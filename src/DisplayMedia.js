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

  render(){
    console.log(this.props.displayList)
    return (
      <div>
          <p> {this.props.displayList.title} </p>
          {!this.props.noResult ? 
            <div className ="imgSpace">
                {this.props.displayList.map((item, index) =>
                  <img className = {"titleImg " + this.props.mediaType + ( index == 1 ? " active" : "" ) } id = "imgs" onClick={(e) => this.handleImgClick(e, index)} key={item.title + "-" + "img" + index} src={item.imgUrl}></img> 
                )}
                {this.props.displayList.map((item, index) =>     
                      <p className = {"titleDesc " + this.props.mediaType + ( index == 1 ? " active" : "" ) } key = {item.title + "-" + "description" + index}>  <b>{item.title}</b> <br/> <br/> {item.description.replace("<br>", "")} </p>   
                )}
         </div> : <p> No results found! </p>}
      </div>);
  }
}
