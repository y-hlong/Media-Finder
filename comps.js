var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DisplayMedia = function (_React$Component) {
  _inherits(DisplayMedia, _React$Component);

  function DisplayMedia(props) {
    _classCallCheck(this, DisplayMedia);

    var _this = _possibleConstructorReturn(this, (DisplayMedia.__proto__ || Object.getPrototypeOf(DisplayMedia)).call(this, props));

    _this.handleData = _this.handleData.bind(_this);
    _this.handleRandomData = _this.handleRandomData.bind(_this);

    _this.state = {
      jsonstr: "Select Genres!",
      loading: true,
      maxPage: 0,
      mediaType: "ANIME",
      displayList: [],
      noResult: false
    };
    return _this;
  }

  _createClass(DisplayMedia, [{
    key: "postGenres",
    value: function postGenres(genreIn, allGenre) {
      //console.log("it ran");
      //console.log(genreIn.length);
      var genreEnable = ",genre_in: " + JSON.stringify(genreIn);

      if (genreIn.length == 0) {
        //console.log("it went in");
        genreEnable = "";
      }
      //console.log(genreEnable);

      //add back $genre_not_in later. Use string add and use prop to check if empty or not, do it for postRandom too
      var query = "\n    query ($page: Int, $perPage: Int) {\n      Page (page: $page, perPage: $perPage) {\n        pageInfo {\n          total\n          currentPage\n          lastPage\n          hasNextPage\n          perPage\n        }\n      media ( type: " + this.state.mediaType + " " + genreEnable + ")  {\n        title \n        {\n          romaji\n        }\n        description\n        genres\n        id\n      }\n    }\n  }\n    ";

      var variables = {
        genre_in: genreIn,
        page: 1,
        perPage: 50
      };

      var url = 'https://graphql.anilist.co',
          options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          query: query,
          variables: variables
        })
      };

      fetch(url, options).then(this.handleResponse).then(this.handleData).catch(this.handleError);
    }
  }, {
    key: "postRandomPages",
    value: function postRandomPages(genreIn, pages) {
      //console.log(genreIn);

      var genreEnable = ",genre_in: " + JSON.stringify(genreIn);
      if (genreIn.length == 0) genreEnable = "";

      var query = "\n    query ($page: Int, $perPage: Int) {\n      Page (page: $page, perPage: $perPage) {\n        pageInfo{\n          total\n          currentPage\n          lastPage\n          hasNextPage\n          perPage\n        }\n        media (type: " + this.state.mediaType + " " + genreEnable + " ) {\n        title {\n          romaji\n        }\n        coverImage\n        {\n          large\n        }\n        externalLinks\n        {\n          url\n          site\n        }\n        description\n        genres\n      }\n    }\n  }\n    ";

      var variables = {
        page: pages,
        perPage: 50
      };

      var url = 'https://graphql.anilist.co',
          options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          query: query,
          variables: variables
        })
      };

      fetch(url, options).then(this.handleResponse).then(this.handleRandomData).catch(this.handleError);
    }
  }, {
    key: "handleResponse",
    value: function handleResponse(response) {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    }
  }, {
    key: "handleData",
    value: function handleData(data) {
      var i;
      console.log(data);

      this.setState(function () {
        return { noResult: false };
      });

      if (data.data.Page.pageInfo.total == 0) {
        this.setState(function () {
          return { noResult: true };
        });
        return;
      }
      //var strData = JSON.stringify(data);
      //console.log(strData);

      this.setState(function () {
        return { maxPage: data.data.Page.pageInfo.lastPage };
      });

      this.setState(function () {
        return { displayList: [] };
      });

      for (i = 0; i < 3; i++) {
        this.postRandomPages(this.props.genreIn, Math.floor(Math.random() * this.state.maxPage));
      } /*
        this.setState(() => {
          return {loading: false};
        });
            //just display it here I guess don't set no states
        document.getElementById("change").
        <div><h1> yo dawg </h1></div>;*/
    }
  }, {
    key: "handleError",
    value: function handleError(error) {
      alert('Error, check console');
      console.error(error);
    }
  }, {
    key: "handleRandomData",
    value: function handleRandomData(data) {
      console.log(data);

      var numItemOnPage = data.data.Page.pageInfo.perPage;
      var randNum = Math.floor(Math.random() * data.data.Page.pageInfo.perPage);

      if (data.data.Page.pageInfo.total < data.data.Page.pageInfo.perPage) {
        randNum = Math.floor(Math.random() * data.data.Page.pageInfo.total);
      } else if (!data.data.Page.pageInfo.hasNextPage) {
        var numOnLastPage = data.data.Page.pageInfo.total - data.data.Page.pageInfo.perPage * (data.data.Page.pageInfo.lastPage - 1);
        randNum = Math.floor(Math.random() * numOnLastPage);
      }

      //console.log(randNum);

      var mediaInfo = {
        title: data.data.Page.media[randNum].title.romaji,
        description: data.data.Page.media[randNum].description == null ? "No description provided" : data.data.Page.media[randNum].description,
        imgUrl: data.data.Page.media[randNum].coverImage.large,
        link: data.data.Page.media[randNum].externalLinks.url,
        siteName: data.data.Page.media[randNum].externalLinks.site
      };

      //console.log(mediaInfo);

      this.setState(function (prevState) {
        return { displayList: prevState.displayList.concat(mediaInfo) };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { id: "submitButton", className: "clickybutton", onClick: function onClick() {
              _this2.postGenres(_this2.props.genreIn, _this2.props.allGenre);
            } },
          " Submit "
        ),
        React.createElement(
          "h1",
          null,
          " ",
          this.props.genreIn,
          " "
        ),
        !this.state.noResult ? React.createElement(
          "div",
          null,
          this.state.displayList.map(function (item, index) {
            return React.createElement(
              "li",
              { key: item.title + "-" + "outterList" },
              " ",
              item.title,
              React.createElement(
                "ul",
                null,
                React.createElement(
                  "div",
                  { className: "imgContainer" },
                  React.createElement("img", { src: item.imgUrl }),
                  React.createElement(
                    "li",
                    { key: item.title + "-" + "innerList" },
                    " ",
                    item.description
                  )
                )
              )
            );
          })
        ) : React.createElement(
          "p",
          null,
          " No results found! "
        ),
        ";"
      );
    }
  }]);

  return DisplayMedia;
}(React.Component);

var GenreSelect = function (_React$Component2) {
  _inherits(GenreSelect, _React$Component2);

  function GenreSelect(props) {
    _classCallCheck(this, GenreSelect);

    var _this3 = _possibleConstructorReturn(this, (GenreSelect.__proto__ || Object.getPrototypeOf(GenreSelect)).call(this, props));

    _this3.handleDrop = _this3.handleDrop.bind(_this3);
    _this3.arraytoTable = _this3.arraytoTable.bind(_this3);
    _this3.handleAddActive = _this3.handleAddActive.bind(_this3);
    _this3.handleData = _this3.handleData.bind(_this3);
    //this.submit = this.submit.bind(this);
    _this3.state = {
      genreArray: [],
      showResult: false,
      genresActive: []

    };
    return _this3;
  }

  _createClass(GenreSelect, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var query = "\n    query {\n      GenreCollection\n   }\n    ";

      var variables = {
        genre_in: ["Romance", "Action"]
      };

      var url = 'https://graphql.anilist.co',
          options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          query: query,
          variables: variables
        })
      };

      fetch(url, options).then(this.handleResponse).then(this.handleData).catch(this.handleError);
    }
  }, {
    key: "handleResponse",
    value: function handleResponse(response) {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    }
  }, {
    key: "handleData",
    value: function handleData(data) {
      this.setState(function (prevState) {
        return { genreArray: data.data.GenreCollection };
      });
      /*
      this.setState((prevState, props) => {
        return {jsonstr: strData};
      });
      this.setState(() => {
        return {loading: false};
      });
      document.getElementById("About").textContent = strData;*/
    }
  }, {
    key: "handleError",
    value: function handleError(error) {
      alert('Error, check console');
      console.error(error);
    }
  }, {
    key: "handleDrop",
    value: function handleDrop() {
      this.setState(function (prevState) {
        return {
          showDrop: !prevState.showDrop
        };
      });
    }
  }, {
    key: "arraytoTable",
    value: function arraytoTable(myArray) {
      var result = "<table class='genretable'><tbody><tr><td class='genrerows'>";
      for (var i = 0; i < myArray.length; i++) {
        result += "<button class='clickybutton' onclick={this.handleAddActive}>" + myArray[i] + "</button>";
      }
      result += "</td></tr></tbody></table>";
      return result;
    }
  }, {
    key: "handleAddActive",
    value: function handleAddActive(e) {
      var i;
      var toAdd = e.currentTarget.innerText;
      if (e.currentTarget.classList.contains("active")) {
        e.currentTarget.className = e.currentTarget.className.replace(" active", "");
        for (i = 0; i < this.state.genresActive.length; i++) {
          if (this.state.genresActive[i] == toAdd) {
            //console.log(this.state.genresActive[i]);
            //console.log(toAdd);
            this.setState(function (prevState) {
              return {
                genresActive: prevState.genresActive.filter(function (_, x) {
                  return x !== i;
                })
              };
            });
            break;
          }
        }
      } else {
        e.currentTarget.className += " active";
        this.setState(function (prevState) {
          return {
            genresActive: prevState.genresActive.concat(toAdd)
          };
        });
      };
    }
  }, {
    key: "submit",
    value: function submit() {
      this.setState(function (prevState) {
        return {
          showResult: !prevState.showResult
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      return React.createElement(
        "div",
        { className: "mainMenues" },
        React.createElement(
          "button",
          { className: "clickybutton", onClick: this.handleDrop },
          " Select Genre "
        ),
        this.state.showDrop ? React.createElement(
          "div",
          { id: "genredrop", className: "dropdowncontent" },
          React.createElement(
            "table",
            { className: "genretable" },
            React.createElement(
              "tbody",
              null,
              React.createElement(
                "tr",
                { className: "genrerows" },
                React.createElement(
                  "td",
                  null,
                  this.state.genreArray.map(function (item, index) {
                    return React.createElement(
                      "button",
                      { key: item + "-" + index, className: "clickybutton" + (_this4.state.genresActive.includes(item) ? " active" : ""), onClick: _this4.handleAddActive },
                      item
                    );
                  })
                )
              )
            )
          ),
          React.createElement(
            "h1",
            { id: "testyy" },
            this.state.genresActive
          )
        ) : "",
        React.createElement(
          "div",
          null,
          React.createElement(DisplayMedia, { genreIn: this.state.genresActive, allGenre: this.state.genreArray })
        )
      );
    }
  }]);

  return GenreSelect;
}(React.Component);

ReactDOM.render(React.createElement(GenreSelect, { genreArray: ["Action", "Comedy", "Romance", "banana", "oh boy", "nani"] }), document.getElementById("testy"));

/*
ReactDOM.render(
  <DisplayMedia />,
  document.getElementById("testy2")
  );*/

/*this.setState((prevState, props) => {
        genreIn: props.genreIn
        });*/