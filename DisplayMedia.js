var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DisplayMedia = function (_React$Component) {
  _inherits(DisplayMedia, _React$Component);

  function DisplayMedia(props) {
    _classCallCheck(this, DisplayMedia);

    var _this = _possibleConstructorReturn(this, (DisplayMedia.__proto__ || Object.getPrototypeOf(DisplayMedia)).call(this, props));

    _this.handleImgClick = _this.handleImgClick.bind(_this);

    return _this;
  }

  _createClass(DisplayMedia, [{
    key: "handleImgClick",
    value: function handleImgClick(e, index) {
      if (!e.currentTarget.classList.contains("active")) {

        var imagesList = document.getElementsByClassName("titleImg " + this.props.mediaType);

        var descriptionList = document.getElementsByClassName("titleDesc " + this.props.mediaType);
        //console.log(descriptionList);
        //console.log(imagesList);
        for (i = 0; i < imagesList.length; i++) {
          imagesList[i].className = imagesList[i].className.replace(" active", "");
          descriptionList[i].className = descriptionList[i].className.replace(" active", "");
        }
        e.currentTarget.classList.add("active");

        descriptionList[index].classList.add("active");
      }
    }

    //Using DOM manipulation. Not ideal, may separate img out into separate components

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      console.log(this.props.displayList);
      return React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          null,
          " ",
          this.props.displayList.title,
          " "
        ),
        !this.props.noResult ? React.createElement(
          "div",
          { className: "imgSpace" },
          this.props.displayList.map(function (item, index) {
            return React.createElement("img", { className: "titleImg " + _this2.props.mediaType + (index == 1 ? " active" : ""), id: "imgs", onClick: function onClick(e) {
                return _this2.handleImgClick(e, index);
              }, key: item.title + "-" + "img" + index, src: item.imgUrl });
          }),
          this.props.displayList.map(function (item, index) {
            return React.createElement(
              "p",
              { className: "titleDesc " + _this2.props.mediaType + (index == 1 ? " active" : ""), key: item.title + "-" + "description" + index },
              "  ",
              React.createElement(
                "b",
                null,
                React.createElement(
                  "a",
                  { className: "titleLink", href: item.id != undefined ? encodeURI("https://anilist.co/anime/" + item.id + "/" + item.title) : encodeURI("https://anilist.co/search/anime?sort=SEARCH_MATCH&search=" + item.title), target: "_blank" },
                  item.title
                )
              ),
              " ",
              React.createElement("br", null),
              " ",
              React.createElement("br", null),
              " ",
              item.description.replace("<br>", ""),
              " "
            );
          })
        ) : React.createElement(
          "p",
          null,
          " No results found! "
        )
      );
    }
  }]);

  return DisplayMedia;
}(React.Component);