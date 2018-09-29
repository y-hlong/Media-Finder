class DisplayMedia extends React.Component{
  constructor(props){
    super(props);

  }

  render(){
    return (
      <div>
          {!this.props.noResult ? 
            <div className ="imgContainer">
                {this.props.displayList.map((item, index) =>
                    
                      <img className = "titleImg" key={item.title + "-" + "outterList"} src={item.imgUrl}></img>
                    
                )}
         </div> : <p> No results found! </p>}         
      </div>);
  }
}

/*<div key = {item.title + "-" + "innerList"}> {item.description}
                      </div>*/



class GenreSelect extends React.Component{
  constructor(props){
    super(props);

    this.handleDrop = this.handleDrop.bind(this);
    this.arraytoTable = this.arraytoTable.bind(this);
    this.handleAddActive = this.handleAddActive.bind(this);
    this.handleData = this.handleData.bind(this);
    this.handleInitialData = this.handleInitialData.bind(this);
    this.submit = this.submit.bind(this);
    this.handleRandomData = this.handleRandomData.bind(this);
    this.postGenres = this.postGenres.bind(this);

    this.state = {
      genreArray:[],
      showResult: false,
      genresActive: [],
      maxPage: 0,
      mediaType: "ANIME",
      displayList: [],
      noResult: false,
      maxResults: 3

    };
  }

  componentDidMount() {
    //get genre list on render
    var query = `
    query {
      GenreCollection
   }
    `;

    var variables = {
      genre_in : ["Romance", "Action"]
    };

    var url = 'https://graphql.anilist.co',
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
            body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    fetch(url, options).then(this.handleResponse)
                       .then(this.handleInitialData)
                       .catch(this.handleError);
  }

  handleResponse(response) {
        return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
    }

  //get genre array from api beforehand  
  handleInitialData(data) {
    console.log(data);
        this.setState((prevState) => {
          return {genreArray: data.data.GenreCollection};
        });
    }

  //controls drop menu state
  handleDrop(){
    this.setState(prevState =>({
      showDrop: !prevState.showDrop
    }));
  }

  //displays genre array to an html table
  arraytoTable(myArray){
    var result = "<table class='genretable'><tbody><tr><td class='genrerows'>";
    for(var i=0; i<myArray.length; i++) {
        result += "<button class='clickybutton' onclick={this.handleAddActive}>"+myArray[i]+"</button>";
    }
    result += "</td></tr></tbody></table>";
    return result;
  }

  //handles select/unselect of genre table
  handleAddActive(e){
    var i;
    var toAdd = e.currentTarget.innerText;
    if (e.currentTarget.classList.contains("active")){
      (e.currentTarget.className = e.currentTarget.className.replace(" active", ""));
      for (i = 0; i < this.state.genresActive.length; i++)
      {
        if (this.state.genresActive[i] == toAdd){
          this.setState(prevState => ({
            genresActive: prevState.genresActive.filter((_, x) => x !== i)
          }));
          break;
        }
      }
    }
    else{
      (e.currentTarget.className += " active");
      this.setState(prevState => ({
        genresActive: prevState.genresActive.concat(toAdd)
      }));
    };
  }

  //posts selected genre to Anilist API
  postGenres(){
    //console.log("it ran");
    //make showResult true once
    this.setState(prevState => ({
        showResult: true
      }));

    console.log(this.state.genresActive);
    var genreEnable = ",genre_in: " + JSON.stringify(this.state.genresActive);

    if (this.state.genresActive.length == 0)
    {
      //console.log("it went in");
      genreEnable = "";
    }
    //console.log(genreEnable);
  
    //add back $genre_not_in later. Use string add and use prop to check if empty or not, do it for postRandom too
    var query = `
    query ($page: Int, $perPage: Int) {
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
      media ( type: `+ this.state.mediaType +` `+ genreEnable + `)  {
        title 
        {
          romaji
        }
        description
        genres
        id
      }
    }
  }
    `;

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
            'Accept': 'application/json',
        },
            body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    fetch(url, options).then(this.handleResponse)
                       .then(this.handleData)
                       .catch(this.handleError);
  }
    
  //checks if response has a result, check amount of pages with selected genres
  handleData(data) {
    var i;
  

    this.setState(() => {
      return {noResult: false};
      });

    if(data.data.Page.pageInfo.total == 0){
      this.setState(() => {
      return {noResult: true};
    });
      return;
    }
    //var strData = JSON.stringify(data);
    //console.log(strData);
    
    this.setState(() => {
      return {maxPage: data.data.Page.pageInfo.lastPage};
    });

    this.setState(() => {
      return {displayList: []};
    });

    //select a random page from a range of 0 to maxPage, and post request to API
    var randPages = [];
    for (i = 0; i < 3; i++)
      randPages.push(Math.floor(Math.random()*this.state.maxPage));

    console.log(randPages);
    this.postRandomPages(randPages);
  }



    postRandomPages(pages){
    //console.log(genreIn);

    var genreEnable = ",genre_in: " + JSON.stringify(this.state.genresActive) ;
    if (this.state.genresActive.length == 0)
      genreEnable = "";

    

    var query = `
    query ($page1: Int, $page2: Int, $page3: Int, $perPage: Int) {
    firstMedia :Page (page: $page1, perPage: $perPage) {
        pageInfo
        {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media (type: `+ this.state.mediaType +` `+ genreEnable + ` ) {
        title 
        {
          romaji
        }
        coverImage 
        {
          large
        }
        bannerImage
        externalLinks 
        {
          url
          site
        }
        description
        genres
      }
    }

    secondMedia: Page (page: $page2, perPage: $perPage) {
        pageInfo
        {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media (type: `+ this.state.mediaType +` `+ genreEnable + ` ) {
        title 
        {
          romaji
        }
        coverImage 
        {
          large
        }
        bannerImage
        externalLinks 
        {
          url
          site
        }
        description
        genres
      }
    }

    thirdMedia: Page (page: $page3, perPage: $perPage) {
        pageInfo
        {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media (type: `+ this.state.mediaType +` `+ genreEnable + ` ) {
        title 
        {
          romaji
        }
        coverImage 
        {
          large
        }
        bannerImage
        externalLinks 
        {
          url
          site
        }
        description
        genres
      }
    }
  }
    `;

    var variables = {
      page1: pages[0],
      page2: pages[1],
      page3: pages[2],
      perPage: 50,
    };

    var url = 'https://graphql.anilist.co',
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
            body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    fetch(url, options).then(this.handleResponse)
                       .then(this.handleRandomData)
                       .catch(this.handleError);
  }


  

  handleError(error) {
    alert('Error, check console');
    console.error(error);
  }

  handleRandomData(data){
    console.log(data.data.firstMedia);


    var numItemOnPage = data.data.firstMedia.pageInfo.perPage;
    var randNum = Math.floor(Math.random()*data.data.firstMedia.pageInfo.perPage);

    if(data.data.firstMedia.pageInfo.total < data.data.firstMedia.pageInfo.perPage){
      randNum = Math.floor(Math.random() * data.data.firstMedia.pageInfo.total);
    }
    else if(!data.data.firstMedia.pageInfo.hasNextPage){
      var numOnLastPage = (data.data.firstMedia.pageInfo.total - data.data.firstMedia.pageInfo.perPage*(data.data.firstMedia.pageInfo.lastPage - 1));
      randNum = Math.floor(Math.random() * numOnLastPage)
    }
    
    //console.log(randNum);

    var mediaInfo = {
      title: data.data.firstMedia.media[randNum].title.romaji,
      description: (data.data.firstMedia.media[randNum].description == null) ? "No description provided" : data.data.firstMedia.media[randNum].description,
      imgUrl: data.data.firstMedia.media[randNum].coverImage.large,
      link: data.data.firstMedia.media[randNum].externalLinks.url,
      siteName: data.data.firstMedia.media[randNum].externalLinks.site,
      bannerUrl: data.data.firstMedia.media[randNum]
    };

    //console.log(mediaInfo);

    this.setState((prevState) => {
      return {displayList: prevState.displayList.concat(mediaInfo)};
    });

  

  }

  submit(){
    console.log("submitted");
    this.setState(prevState => ({
        showResult: !prevState.showResult
      }));
  }

  render(){
    return(
      <div className="mainMenues">
        <button className="clickybutton" onClick={this.handleDrop}> Select Genre </button>
        {this.state.showDrop ? (
          <div id ="genredrop" className="dropdowncontent"> 
          <table className="genretable">
            <tbody>
              <tr className="genrerows">
              <td>
               {this.state.genreArray.map((item, index) =>
                <button key={item + "-" + index} className={"clickybutton"+(this.state.genresActive.includes(item) ? " active": "") }onClick={this.handleAddActive}>{item}</button> 
                )}
              </td>
              </tr>
              </tbody>
            </table>
            <h1>{this.state.genresActive}</h1>
          </div>):""}
          <button id ="submitButton" className="clickybutton" onClick={() => {this.postGenres(this.state.genresActive, this.state.genreArray);}}> Submit </button>
          {this.state.showResult ? <DisplayMedia displayList = {this.state.displayList} noResult = {this.state.noResult} allGenre={this.state.genreArray}/>: ""}
      </div>
      
      );
  }
}

ReactDOM.render(
  <GenreSelect genreArray={["Action","Comedy","Romance", "banana", "oh boy", "nani"]}/>,
  document.getElementById("testy")
  );
