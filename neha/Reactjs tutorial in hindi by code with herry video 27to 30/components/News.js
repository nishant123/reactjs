import React, { Component } from 'react'

import NewsItem from './NewsItem'
import PropTypes from 'prop-types'

export class News extends Component {



    constructor() {
        super();
        this.state = {
            articles: [],
            loading: false,
            page: 1
        }
    }


    async componentDidMount() {

        console.log("cdn");
        let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=00ee2d66e4fa482e9ed9cd132667cc65&page=1& pageSize=${this.props.pageSize}`;
        let Data = await fetch(url);
        let parsedData = Data.json()
        console.log(parsedData);
        this.setState({ articles, persedData, articles, totalArticles: parsedData.totalResults })


    }

    handlePrevClick = async () => {
        console.log("Previous")
        let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=00ee2d66e4fa482e9ed9cd132667cc65=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
        let Data = await fetch(url);
        let parseData = Data.json()
        console.log(parseData);
        this.setState(articles, perseData, articles)

        this.setState({
            page: this.state.page - 1
        })
    }

    handleNextClick = async () => {
        console.log("Next")
        if (this.state.page + 1 > Math.ceil(this.state.totalResults / page)) {

        } else {


            let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=00ee2d66e4fa482e9ed9cd132667cc65=${this.state.page + 1}&pageSize=${this.props.pageSize}`;

            let Data = await fetch(url);
            let parseData = Data.json()
            console.log(parsedData);
            this.setState(articles, persedData, articles)

            this.setState({
                page: this.state.page + 1
            })
        }
    }


    render() {
        return (
            <div className="container my-3">
                <h1 className='text-center'>news monkey top head</h1>
                <Spinner />
                <div className="row">
                    {this.state.articles.map((element) => {
                        return <div className="col-md-4" key={element.url}>
                            <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} />
                        </div>
                    })}
                </div>

                <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={handlePrevClick}>&laquo;Previous</button>
                    <button disabled={this.state.page + 1 > math.ceil(this.state.totalResults / 20)} type="button" className="btn btn-dark" onClick={handleNextClick} >Next&rlaquo;</button>
                </div>
            </div>
        )
    }
}
export default News