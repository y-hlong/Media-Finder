class DisplayMedia extends React.Component{
  constructor(props){
    super(props);

    this.handleImgClick = this.handleImgClick.bind(this);

  }

  handleImgClick(e, index){
    if (!e.currentTarget.classList.contains("active"))
    {

      var imagesList = document.getElementsByClassName("titleImg " + this.props.mediaType);
      
      var descriptionList = document.getElementsByClassName("titleDesc " + this.props.mediaType);
      //console.log(descriptionList);
      //console.log(imagesList);
      for (i = 0; i < imagesList.length; i++){
        imagesList[i].className = imagesList[i].className.replace(" active", "");
        descriptionList[i].className = descriptionList[i].className.replace(" active", "");
      }
      e.currentTarget.classList.add("active");
      
      
      descriptionList[index].classList.add("active");
    }

  }

  //Using DOM manipulation. Not ideal, may separate img out into separate components
  render(){
    console.log(this.props.displayList)
    return (
      <div>
          <p> {this.props.displayList.title} </p>
          {!this.props.noResult ? 
            <div>
            {this.props.displayList.length == 0 ? <p>Loading</p> : ""}
            <div className ="imgSpace">
                {this.props.displayList.map((item, index) =>
                  <img className = {"titleImg " + this.props.mediaType + ( index == 1 ? " active selected" : "" ) } id = "imgs" onClick={(e) => this.handleImgClick(e, index)} key={item.title + "-" + "img" + index} src={item.imgUrl}></img> 
                  
                )}
             </div> 
                <div className = "textSpace">
                {this.props.displayList.map((item, index) =>     
                      <p className = {"titleDesc " + this.props.mediaType + ( index == 1 ? " active" : "" ) } key = {item.title + "-" + "description" + index}>  <b>{<a className = "titleLink" href = {item.id != undefined ? encodeURI("https://anilist.co/" + this.props.mediaType + "/" + item.id + "/" + item.title) : encodeURI("https://anilist.co/search/anime?sort=SEARCH_MATCH&search=" + item.title)} target = "_blank"> {item.title} </a>}</b> <br/> <br/> {item.description.replace("<br>", "")} </p>   
                )}
            </div>
         </div>: <p> No results found! </p>}
      </div>);
  }
}
