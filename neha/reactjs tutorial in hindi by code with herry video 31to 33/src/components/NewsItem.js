import { getByTitle } from '@testing-library/react'
import React, { Component } from 'react'

export class NewsItem extends Component {



    render() {
        let { title, description, imageUrl, newsUrl, author, date, source } = this.props;
        return (
            <div className="my-3">
                <div className="card">
                    <span className="position-absolute top-0 translate top-0 translate-middle badge rounded-pill bg-danger" style={left:90%;z-index:1}>{source}</span>
                <img src={imageUrl ? "https://www.foxbusiness.com/economy/jeff-bezos-responds-to-elon-musks-poll-asking-if-twitter-hq-should-be-converted-into-homeless-shelter" : imageUrl} className="card-img-top" alt="..." className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{title}<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{source}
                        99+
                    </span></h5>
                    <p className="card-text">{description}...</p>
                    <p class="card-text"><small class="text-muted">By {author ? "Unknown" : author}on {new date(date).GMTString()}</small></p>
                    <a rel="noreferrer" href={newsUrl} target="_blank" className="btn btn-sm btn-dark">READ more...</a>
                </div>
            </div>
            </div >
        )
    }
}

export default NewsItem