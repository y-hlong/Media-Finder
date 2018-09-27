class DisplayMedia extends React.Component{
  constructor(props){
    super(props);

    this.handleData = this.handleData.bind(this);
    this.handleRandomData = this.handleRandomData.bind(this);

    this.state = {
      jsonstr: "Select Genres!",
      loading: true,
      maxPage: 0,
      mediaType: "ANIME",
      displayList: [],
      noResult: false
    };
  }


  postGenres(genreIn, allGenre){
    //console.log("it ran");
    //console.log(genreIn.length);
    var genreEnable = ",genre_in: " + JSON.stringify(genreIn) ;

    if (genreIn.length == 0)
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
      genre_in: genreIn,
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
    

    postRandomPages(genreIn, pages){
    //console.log(genreIn);

    var genreEnable = ",genre_in: " + JSON.stringify(genreIn) ;
    if (genreIn.length == 0)
      genreEnable = "";

    

    var query = `
    query ($page: Int, $perPage: Int) {
      Page (page: $page, perPage: $perPage) {
        pageInfo{
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media (type: `+ this.state.mediaType +` `+ genreEnable + ` ) {
        title {
          romaji
        }
        coverImage
        {
          large
        }
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
      page: pages,
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



  handleResponse(response) {
      return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
  });
  }

  handleData(data) {
    var i;
    console.log(data);

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



    for (i = 0; i < 3; i++)
      this.postRandomPages(this.props.genreIn, Math.floor(Math.random()*this.state.maxPage));

    /*
    this.setState(() => {
      return {loading: false};
    });
        //just display it here I guess don't set no states
    document.getElementById("change").
    <div><h1> yo dawg </h1></div>;*/
  }

  handleError(error) {
    alert('Error, check console');
    console.error(error);
  }

  handleRandomData(data){
    console.log(data);


    var numItemOnPage = data.data.Page.pageInfo.perPage;
    var randNum = Math.floor(Math.random()*data.data.Page.pageInfo.perPage);

    if(data.data.Page.pageInfo.total < data.data.Page.pageInfo.perPage){
      randNum = Math.floor(Math.random() * data.data.Page.pageInfo.total);
    }
    else if(!data.data.Page.pageInfo.hasNextPage){
      var numOnLastPage = (data.data.Page.pageInfo.total - data.data.Page.pageInfo.perPage*(data.data.Page.pageInfo.lastPage - 1));
      randNum = Math.floor(Math.random() * numOnLastPage)
    }
    
    //console.log(randNum);

    var mediaInfo = {
      title: data.data.Page.media[randNum].title.romaji,
      description: (data.data.Page.media[randNum].description == null) ? "No description provided" : data.data.Page.media[randNum].description,
      imgUrl: data.data.Page.media[randNum].coverImage.large,
      link: data.data.Page.media[randNum].externalLinks.url,
      siteName: data.data.Page.media[randNum].externalLinks.site
    };

    //console.log(mediaInfo);

    this.setState((prevState) => {
      return {displayList: prevState.displayList.concat(mediaInfo)};
    });

  

  }

  render(){
    return (
      <div>
        <button id="submitButton" className="clickybutton" onClick={() => {this.postGenres(this.props.genreIn, this.props.allGenre)}}> Submit </button>
        <h1> {this.props.genreIn} </h1> 
          {!this.state.noResult ? 
            <div>
                {this.state.displayList.map((item, index) =>
                <li key={item.title + "-" + "outterList"}> {item.title}
                  <ul>
                    <div className="imgContainer">
                      <img src={item.imgUrl}></img>
                      <li key = {item.title + "-" + "innerList"}> {item.description}
                      </li>
                    </div>
                  </ul>
                </li>)}
         </div>:(<p> No results found! </p>)}         
        
      </div>
        
      );
  }
}





class GenreSelect extends React.Component{
  constructor(props){
    super(props);

    this.handleDrop = this.handleDrop.bind(this);
    this.arraytoTable = this.arraytoTable.bind(this);
    this.handleAddActive = this.handleAddActive.bind(this);
    this.handleData = this.handleData.bind(this);
    //this.submit = this.submit.bind(this);
    this.state = {
      genreArray:[],
      showResult: false,
      genresActive: []

    };
  }

  componentDidMount() {
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
                       .then(this.handleData)
                       .catch(this.handleError);
  }

  handleResponse(response) {
        return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
    }

  handleData(data) {
        this.setState((prevState) => {
          return {genreArray: data.data.GenreCollection};
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

  handleError(error) {
      alert('Error, check console');
      console.error(error);
    }

  handleDrop(){
    this.setState(prevState =>({
      showDrop: !prevState.showDrop
    }));
  }

  arraytoTable(myArray){
    var result = "<table class='genretable'><tbody><tr><td class='genrerows'>";
    for(var i=0; i<myArray.length; i++) {
        result += "<button class='clickybutton' onclick={this.handleAddActive}>"+myArray[i]+"</button>";
    }
    result += "</td></tr></tbody></table>";
    return result;
  }

  handleAddActive(e){
    var i;
    var toAdd = e.currentTarget.innerText;
    if (e.currentTarget.classList.contains("active")){
      (e.currentTarget.className = e.currentTarget.className.replace(" active", ""));
      for (i = 0; i < this.state.genresActive.length; i++)
      {
        if (this.state.genresActive[i] == toAdd){
          //console.log(this.state.genresActive[i]);
          //console.log(toAdd);
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

  submit(){
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
            <h1 id="testyy">{this.state.genresActive}</h1>
          </div>):""}
          <div><DisplayMedia genreIn={this.state.genresActive} allGenre={this.state.genreArray}/></div>
      </div>
      
      );
  }
}

ReactDOM.render(
  <GenreSelect genreArray={["Action","Comedy","Romance", "banana", "oh boy", "nani"]}/>,
  document.getElementById("testy")
  );

/*
ReactDOM.render(
  <DisplayMedia />,
  document.getElementById("testy2")
  );*/

/*this.setState((prevState, props) => {
        genreIn: props.genreIn
        });*/