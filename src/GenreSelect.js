class GenreSelect extends React.Component{
  constructor(props){
    super(props);

    this.handleDropInc = this.handleDropInc.bind(this);
    this.handleDropExc = this.handleDropExc.bind(this);
    this.arraytoTable = this.arraytoTable.bind(this);
    this.handleAddActiveInc = this.handleAddActiveInc.bind(this);
    this.handleAddActiveExc = this.handleAddActiveExc.bind(this);
    this.handleData = this.handleData.bind(this);
    this.handleInitialData = this.handleInitialData.bind(this);
    this.submit = this.submit.bind(this);
    this.handleRandomData = this.handleRandomData.bind(this);
    this.postGenres = this.postGenres.bind(this);

    this.state = {
      genreArray:[],
      showResult: false,
      genresActiveInc: [],
      genresActiveExc: ["Hentai"],
      maxPage: 0,
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
    //console.log(data);
        this.setState((prevState) => {
          return {genreArray: data.data.GenreCollection};
        });
    }

  //controls drop menu state of include menu
  handleDropInc(){
    //console.log("dropped");
    this.setState(prevState =>({
      showDropInc: !prevState.showDropInc,
      showDropExc: false
    }));
  }

  //controls drop menu state of exclude menu
  handleDropExc(){
    //console.log("dropped");
    this.setState(prevState =>({
      showDropExc: !prevState.showDropExc,
      showDropInc: false
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

  //handles select/deselect of include genre table 
  handleAddActiveInc(e){
    var i;
    var toAdd = e.currentTarget.innerText;
    if (e.currentTarget.classList.contains("active")){
      for (i = 0; i < this.state.genresActiveInc.length; i++)
      {
        if (this.state.genresActiveInc[i] == toAdd){
          this.setState(prevState => ({
            genresActiveInc: prevState.genresActiveInc.filter((_, x) => x !== i)
          }));
          break;
        }
          
      }
    }
    else{
      for (i = 0; i < this.state.genresActiveExc.length; i++)
      {
        if (this.state.genresActiveExc[i] == toAdd){
            this.setState(prevState => ({
              genresActiveExc: prevState.genresActiveExc.filter((_, x) => x !== i)
            }));
            break;
          }
      }
      this.setState(prevState => ({
        genresActiveInc: prevState.genresActiveInc.concat(toAdd)
      }));
    };
  }

  //handle exclude table
  handleAddActiveExc(e){
    var i;
    var toAdd = e.currentTarget.innerText;
    if (e.currentTarget.classList.contains("active")){
      for (i = 0; i < this.state.genresActiveExc.length; i++)
      {
        if (this.state.genresActiveExc[i] == toAdd){
          this.setState(prevState => ({
            genresActiveExc: prevState.genresActiveExc.filter((_, x) => x !== i)
          }));
          break;
        }
      }
    }
    else{
      for (i = 0; i < this.state.genresActiveInc.length; i++)
      {
        if (this.state.genresActiveInc[i] == toAdd){
            this.setState(prevState => ({
              genresActiveInc: prevState.genresActiveInc.filter((_, x) => x !== i)
            }));
            break;
          }
      }
      this.setState(prevState => ({
        genresActiveExc: prevState.genresActiveExc.concat(toAdd)
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

    //checks if include and/or exclude is empty
    if (this.state.genresActiveInc.length == 0)
      genreInclude = "";
    else
      var genreInclude = ",genre_in: " + JSON.stringify(this.state.genresActiveInc);

    if (this.state.genresActiveExc.length == 0)
      genreExclude = "";
    else
      var genreExclude = ",genre_not_in: " + JSON.stringify(this.state.genresActiveExc);
    
  
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
      media ( type: `+ this.props.mediaType +` `+ genreInclude + ` ` + genreExclude +`)  {
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

    //console.log(randPages);
    this.postRandomPages(randPages);
  }



    postRandomPages(pages){
    //console.log(genreIn);

    if (this.state.genresActiveInc.length == 0)
      genreInclude = "";
    else
      var genreInclude = ",genre_in: " + JSON.stringify(this.state.genresActiveInc);

    if (this.state.genresActiveExc.length == 0)
      genreExclude = "";
    else
      var genreExclude = ",genre_not_in: " + JSON.stringify(this.state.genresActiveExc);

    

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
        media (type: `+ this.props.mediaType +` `+ genreInclude + ` `+ genreExclude + ` ) {
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
        media (type: `+ this.props.mediaType +` `+ genreInclude + ` `+ genreExclude + ` ) {
        id
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
        media (type: `+ this.props.mediaType +` `+ genreInclude + ` `+ genreExclude + `  ) {
        id
        title 
        {
          romaji
        }
        coverImage 
        {
          large
        }
        bannerImage
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
    console.log(data);
    var holder = [];
    for (var key in data.data){
      if (data.data.hasOwnProperty(key))
      {
        var val = data.data[key];
        

        var numItemOnPage = val.pageInfo.perPage;
        var randNum = Math.floor(Math.random()*val.pageInfo.perPage);

        if(val.pageInfo.total < val.pageInfo.perPage){
          randNum = Math.floor(Math.random() * val.pageInfo.total);
        }
        else if(!val.pageInfo.hasNextPage){
          var numOnLastPage = (val.pageInfo.total - val.pageInfo.perPage*(data.data.firstMedia.pageInfo.lastPage - 1));
          randNum = Math.floor(Math.random() * numOnLastPage);
        }
    
    //console.log(randNum);
        var tempDesc = null;

        (val.media[randNum].description != null ? tempDesc = val.media[randNum].description.replace(/<br>/g, "\n"): null );

        var mediaInfo = {
          title: val.media[randNum].title.romaji,
          description: (tempDesc == null) ? "No description provided" : tempDesc,
          imgUrl: val.media[randNum].coverImage.large,
          bannerUrl: val.media[randNum],
          id: val.media[randNum].id
        };

        holder = holder.concat(mediaInfo);
      }
    }

    //console.log(holder);
    this.setState((prevState) => {
        return {displayList: holder};
        });
  }

  submit(){
    //console.log("submitted");
    this.setState(prevState => ({
        showResult: !prevState.showResult
      }));
  }

  //selected genres manipulates DOM, may migrate to using states instead
  //create component Genre, map to Genre with props name and on click function from this component that toggle whether something is active. Keep track of active in this, then when mapping check if name is part of active ? active=true : active=false
  render(){
    return(
      <div className="mainMenues">
          <GenreDropDown classType = "includeBtn" innerText="Include Genre"  genresActive={this.state.genresActiveInc} genreArray={this.state.genreArray} handleAddActive={this.handleAddActiveInc} handleShowDrop={this.handleDropInc} showDrop={this.state.showDropInc}/>
          <GenreDropDown classType = "excludeBtn" innerText="Exclude Genre"  genresActive={this.state.genresActiveExc} genreArray={this.state.genreArray} handleAddActive={this.handleAddActiveExc} handleShowDrop={this.handleDropExc} showDrop={this.state.showDropExc}/>
          <button id ="submitButton" className="clickybutton" onClick={() => {this.postGenres(this.state.genresActive, this.state.genreArray); this.setState(prevState =>({showDrop: false}));}}> Submit </button>
          {this.state.showResult ? <DisplayMedia displayList = {this.state.displayList} noResult = {this.state.noResult} mediaType = {this.props.mediaType}/>: ""}
      </div>
      
      );
  }
}

ReactDOM.render(
  <GenreSelect mediaType = "ANIME"/>,
  document.getElementById("animeMedia")
  );

ReactDOM.render(
  <GenreSelect mediaType = "MANGA"/>,
  document.getElementById("mangaMedia")
  );
