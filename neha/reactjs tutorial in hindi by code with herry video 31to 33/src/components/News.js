import React, { Component } from 'react'

import NewsItem from './NewsItem'
import PropTypes from 'prop-types'

export class News extends Component {

    static defaultProps = {
        country: 'in',
        pageSize: 8,
        category: 'general'
    }
    static propTypes = {
        country: Proptypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase + string.slice(1);
    }
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: false,
            page: 1
        }
        document.title = `${this.props.category}` - NewsMonkey`;
    }

    async updateNews(pageNo) {
        console.log("cdn");
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=00ee2d66e4fa482e9ed9cd132667cc65&page=1& pageSize=${this.props.pageSize}`;
        this.setState({ loading: true });
        let Data = await fetch(url);
        let parsedData = Data.json()
        console.log(parsedData);
        this.setState({ articles, persedData, articles, totalArticles: parsedData.totalResults })
    }

    async componentDidMount() {
        this.updateNews();
    }

    handlePrevClick = async () => {
        this.setState({ page: this.state.page - 1 })
        this.updateNews();
    }

    handleNextClick = async () => {
        console.log("Next")
        this.setState({ page: this.state.page + 1 })
        this.updateNews();
    }


    render() {
        return (
            <div className="container my-3">
                <h1 className='text-center'>NewsMonkey - Top Headlines on{this.capitalizedFirstLetter(this.props.category)}Category</h1>
                <Spinner />
                <div className="row">
                    {this.state.articles.map((element) => {
                        return <div className="col-md-4" key={element.url}>
                            <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
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