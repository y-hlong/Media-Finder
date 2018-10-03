var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GenreDropDown = function (_React$Component) {
  _inherits(GenreDropDown, _React$Component);

  function GenreDropDown(props) {
    _classCallCheck(this, GenreDropDown);

    return _possibleConstructorReturn(this, (GenreDropDown.__proto__ || Object.getPrototypeOf(GenreDropDown)).call(this, props));
  }

  //selected genres manipulates DOM, may migrate to using states instead
  //create component Genre, map to Genre with props name and on click function from this component that toggle whether something is active. Keep track of active in this, then when mapping check if name is part of active ? active=true : active=false


  _createClass(GenreDropDown, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(
        "div",
        { className: "genredropdown" },
        React.createElement(
          "button",
          { className: "clickybutton", onClick: this.props.handleShowDrop },
          " ",
          this.props.innerText,
          " "
        ),
        this.props.showDrop ? React.createElement(
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
                  this.props.genreArray.map(function (item, index) {
                    return React.createElement(
                      "button",
                      { key: item + "-" + index, className: "clickybutton " + _this2.props.classType + (_this2.props.genresActive.includes(item) ? " active" : ""), onClick: _this2.props.handleAddActive },
                      item
                    );
                  })
                )
              )
            )
          )
        ) : ""
      );
    }
  }]);

  return GenreDropDown;
}(React.Component);