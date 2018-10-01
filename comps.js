var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GenreSelect = function (_React$Component) {
  _inherits(GenreSelect, _React$Component);

  function GenreSelect(props) {
    _classCallCheck(this, GenreSelect);

    var _this = _possibleConstructorReturn(this, (GenreSelect.__proto__ || Object.getPrototypeOf(GenreSelect)).call(this, props));

    _this.handleDrop = _this.handleDrop.bind(_this);
    _this.arraytoTable = _this.arraytoTable.bind(_this);
    _this.handleAddActive = _this.handleAddActive.bind(_this);
    _this.handleData = _this.handleData.bind(_this);
    _this.handleInitialData = _this.handleInitialData.bind(_this);
    _this.submit = _this.submit.bind(_this);
    _this.handleRandomData = _this.handleRandomData.bind(_this);
    _this.postGenres = _this.postGenres.bind(_this);

    _this.state = {
      genreArray: [],
      showResult: false,
      genresActive: [],
      maxPage: 0,
      displayList: [],
      noResult: false,
      maxResults: 3

    };
    return _this;
  }

  _createClass(GenreSelect, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      //get genre list on render
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

      fetch(url, options).then(this.handleResponse).then(this.handleInitialData).catch(this.handleError);
    }
  }, {
    key: "handleResponse",
    value: function handleResponse(response) {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    }

    //get genre array from api beforehand  

  }, {
    key: "handleInitialData",
    value: function handleInitialData(data) {
      //console.log(data);
      this.setState(function (prevState) {
        return { genreArray: data.data.GenreCollection };
      });
    }

    //controls drop menu state

  }, {
    key: "handleDrop",
    value: function handleDrop() {
      //console.log("dropped");
      this.setState(function (prevState) {
        return {
          showDrop: !prevState.showDrop
        };
      });
    }

    //displays genre array to an html table

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

    //handles select/unselect of genre table

  }, {
    key: "handleAddActive",
    value: function handleAddActive(e) {
      var i;
      var toAdd = e.currentTarget.innerText;
      if (e.currentTarget.classList.contains("active")) {
        e.currentTarget.className = e.currentTarget.className.replace(" active", "");
        for (i = 0; i < this.state.genresActive.length; i++) {
          if (this.state.genresActive[i] == toAdd) {
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

    //posts selected genre to Anilist API

  }, {
    key: "postGenres",
    value: function postGenres() {
      //console.log("it ran");
      //make showResult true once
      this.setState(function (prevState) {
        return {
          showResult: true
        };
      });

      //console.log(this.state.genresActive);
      var genreEnable = ",genre_in: " + JSON.stringify(this.state.genresActive);

      if (this.state.genresActive.length == 0) {
        //console.log("it went in");
        genreEnable = "";
      }
      //console.log(genreEnable);

      //add back $genre_not_in later. Use string add and use prop to check if empty or not, do it for postRandom too
      var query = "\n    query ($page: Int, $perPage: Int) {\n      Page (page: $page, perPage: $perPage) {\n        pageInfo {\n          total\n          currentPage\n          lastPage\n          hasNextPage\n          perPage\n        }\n      media ( type: " + this.props.mediaType + " " + genreEnable + ")  {\n        title \n        {\n          romaji\n        }\n        description\n        genres\n        id\n      }\n    }\n  }\n    ";

      var variables = {
        genre_in: this.state.genresActive,
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

    //checks if response has a result, check amount of pages with selected genres

  }, {
    key: "handleData",
    value: function handleData(data) {
      var i;

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

      //select a random page from a range of 0 to maxPage, and post request to API
      var randPages = [];
      for (i = 0; i < 3; i++) {
        randPages.push(Math.floor(Math.random() * this.state.maxPage));
      } //console.log(randPages);
      this.postRandomPages(randPages);
    }
  }, {
    key: "postRandomPages",
    value: function postRandomPages(pages) {
      //console.log(genreIn);

      var genreEnable = ",genre_in: " + JSON.stringify(this.state.genresActive);
      if (this.state.genresActive.length == 0) genreEnable = "";

      var query = "\n    query ($page1: Int, $page2: Int, $page3: Int, $perPage: Int) {\n    firstMedia :Page (page: $page1, perPage: $perPage) {\n        pageInfo\n        {\n          total\n          currentPage\n          lastPage\n          hasNextPage\n          perPage\n        }\n        media (type: " + this.props.mediaType + " " + genreEnable + " ) {\n        title \n        {\n          romaji\n        }\n        coverImage \n        {\n          large\n        }\n        bannerImage\n        externalLinks \n        {\n          url\n          site\n        }\n        description\n        genres\n      }\n    }\n\n    secondMedia: Page (page: $page2, perPage: $perPage) {\n        pageInfo\n        {\n          total\n          currentPage\n          lastPage\n          hasNextPage\n          perPage\n        }\n        media (type: " + this.props.mediaType + " " + genreEnable + " ) {\n        id\n        title \n        {\n          romaji\n        }\n        coverImage \n        {\n          large\n        }\n        bannerImage\n        externalLinks \n        {\n          url\n          site\n        }\n        description\n        genres\n      }\n    }\n\n    thirdMedia: Page (page: $page3, perPage: $perPage) {\n        pageInfo\n        {\n          total\n          currentPage\n          lastPage\n          hasNextPage\n          perPage\n        }\n        media (type: " + this.props.mediaType + " " + genreEnable + " ) {\n        id\n        title \n        {\n          romaji\n        }\n        coverImage \n        {\n          large\n        }\n        bannerImage\n        description\n        genres\n      }\n    }\n  }\n    ";

      var variables = {
        page1: pages[0],
        page2: pages[1],
        page3: pages[2],
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
    key: "handleError",
    value: function handleError(error) {
      alert('Error, check console');
      console.error(error);
    }
  }, {
    key: "handleRandomData",
    value: function handleRandomData(data) {
      console.log(data);
      var holder = [];
      for (var key in data.data) {
        if (data.data.hasOwnProperty(key)) {
          var val = data.data[key];

          var numItemOnPage = val.pageInfo.perPage;
          var randNum = Math.floor(Math.random() * val.pageInfo.perPage);

          if (val.pageInfo.total < val.pageInfo.perPage) {
            randNum = Math.floor(Math.random() * val.pageInfo.total);
          } else if (!val.pageInfo.hasNextPage) {
            var numOnLastPage = val.pageInfo.total - val.pageInfo.perPage * (data.data.firstMedia.pageInfo.lastPage - 1);
            randNum = Math.floor(Math.random() * numOnLastPage);
          }

          //console.log(randNum);
          var tempDesc = null;
          val.media[randNum].description != null ? tempDesc = val.media[randNum].description.replace(/<br>/g, "\n") : null;
          var mediaInfo = {
            title: val.media[randNum].title.romaji,
            description: tempDesc == null ? "No description provided" : tempDesc,
            imgUrl: val.media[randNum].coverImage.large,
            bannerUrl: val.media[randNum],
            id: val.media[randNum].id
          };

          holder = holder.concat(mediaInfo);
        }
      }

      //console.log(holder);
      this.setState(function (prevState) {
        return { displayList: holder };
      });
    }
  }, {
    key: "submit",
    value: function submit() {
      //console.log("submitted");
      this.setState(function (prevState) {
        return {
          showResult: !prevState.showResult
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

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
                      { key: item + "-" + index, className: "clickybutton" + (_this2.state.genresActive.includes(item) ? " active" : ""), onClick: _this2.handleAddActive },
                      item
                    );
                  })
                )
              )
            )
          ),
          React.createElement(
            "h1",
            null,
            this.state.genresActive
          )
        ) : "",
        React.createElement(
          "button",
          { id: "submitButton", className: "clickybutton", onClick: function onClick() {
              _this2.postGenres(_this2.state.genresActive, _this2.state.genreArray);_this2.setState(function (prevState) {
                return { showDrop: false };
              });
            } },
          " Submit "
        ),
        this.state.showResult ? React.createElement(DisplayMedia, { displayList: this.state.displayList, noResult: this.state.noResult, mediaType: this.props.mediaType }) : ""
      );
    }
  }]);

  return GenreSelect;
}(React.Component);

ReactDOM.render(React.createElement(GenreSelect, { mediaType: "ANIME" }), document.getElementById("animeMedia"));

ReactDOM.render(React.createElement(GenreSelect, { mediaType: "MANGA" }), document.getElementById("mangaMedia"));