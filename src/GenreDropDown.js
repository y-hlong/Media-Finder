class GenreDropDown extends React.Component{
  constructor(props){
    super(props);

  }


  //selected genres manipulates DOM, may migrate to using states instead
  //create component Genre, map to Genre with props name and on click function from this component that toggle whether something is active. Keep track of active in this, then when mapping check if name is part of active ? active=true : active=false
  render(){
    return(
      <div className="genredropdown">
        <button className="clickybutton" onClick={this.props.handleShowDrop}> {this.props.innerText} </button>
        {this.props.showDrop ? (
          <div id ="genredrop" className="dropdowncontent"> 
          <table className="genretable">
            <tbody>
              <tr className="genrerows">
                <td>
                  {this.props.genreArray.map((item, index) =>
                  <button key={item + "-" + index} className={"clickybutton " + this.props.classType + (this.props.genresActive.includes(item) ? " active": "") } onClick={this.props.handleAddActive}>{item}</button> 
                  )}
                </td>
              </tr>
              </tbody>
            </table>
          </div>):""}
      </div>
      
      );
  }
}