import React, { useEffect, useState } from 'react'

import NewsItem from './NewsItem'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'
export class News extends Component {

    const News = (props) => {
        const [articles, setArticles] = useState([])
        const [loading, setLoading] = useState(true)
        const [page, setPage] = useState(1)
        const [totalResults, setTotalResults] = useState(0)




        const capitalizeFirstLetter = (string) => {
            return string.charAt(0).toUpperCase + string.slice(1);
        }
        const constructor(props) {
            super(props);
            state = {
                articles: [],
                loading: false,
                page: 1,
                totalResults: 0
            }
            document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
        }

        const updateNews = async () => {
            props.setProgress(10);
            console.log("cdn");
            const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=00ee2d66e4fa482e9ed9cd132667cc65&page=1& pageSize=${props.pageSize}`;
            setState({ loading: true });
            let Data = await fetch(url);
            props.setProgress(30)
            let parsedData = await Data.json()
            props.setProgress(70);
            console.log(parsedData);
            setState({
                articles: persedData.articles,
                totalArticles: parsedData.totalResults,
                loading: false
            })
            props.setProgress(100);
        }

        useEffect(() => {
            updateNews();

        }, [])

        const componentDidMount() {
            updateNews();
        }

        const handlePrevClick = async () => {
            setPage(page - 1)

            updateNews();
        }

        const handleNextClick = async () => {
            console.log("Next")

            setPage(page + 1)
            updateNews();
        }
        const fetchMoreData = async () => {
            setstate({ page: page + 1 })
            updateNews()
            const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=00ee2d66e4fa482e9ed9cd132667cc65&page=1& pageSize=${props.pageSize}`;
            setState({ loading: true });
            let Data = await fetch(url);
            let parsedData = Data.json()
            setState(articles.concat(parsedData.articals))
            setTotalResults(parsedData.totalResults)
            setState({
                articles: articles.concat(persedData.articles),
                totalArticles: parsedData.totalResults,
                loading: false
            })
        };

        render() {
            return (

                <h1 className='text-center'>NewsMonkey - Top Headlines from{capitalizedFirstLetter(props.category)}</h1>

                { loading && <Spinner /> }
        <InfiniteScroll
            dataLength={articles.length}
            next={fetchMoreData}
            hasMore={articles.length !==totalResults}
            loader={<Spinner/>}


            <div className='container'>

            </div>
            <div className="row">
                {articles.map((element) => {
                    return <div className="col-md-4" key={element.url}>
                        <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                    </div>
                })}
            </div>
        </div >
                </InfiniteScroll >
                <div className="container d-flex justify-content-between">
                    <button disabled={page <= 1} type="button" className="btn btn-dark" onClick={handlePrevClick}>&laquo;Previous</button>
                    <button disabled={page + 1 > math.ceil(totalResults / 20)} type="button" className="btn btn-dark" onClick={handleNextClick} >Next&rlaquo;</button>
                </div>
            </div >
        )
        }
    }


    News.defaultProps = {
        country: 'in',
        pageSize: 8,
        category: 'general'
    }
    News.propTypes = {
        country: Proptypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }
export default News