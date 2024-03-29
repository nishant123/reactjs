import React, { Component } from 'react'
import NewsItem from './NewsItem'

export class News extends Component {

    articles = [
        {
            "source": {
                "id": "reuters",
                "name": "Reuters"
            },
            "author": null,
            "title": "Twitter says billionaire Musk not joining its board, warns of 'distractions ahead' - Reuters",
            "description": "Twitter Inc <a href=\"https://www.reuters.com/companies/TWTR.N\" target=\"_blank\">(TWTR.N)</a> said on Sunday that Elon Musk rejected its offer to join the social media firm's board, a dramatic turn in a week when the billionaire became its biggest shareholder, …",
            "url": "https://www.reuters.com/business/elon-musk-decides-not-join-twitter-board-2022-04-11/",
            "urlToImage": "https://www.reuters.com/resizer/5EqBkdE60OyCPF_JVcI1oNGSa0M=/1200x628/smart/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/NOS6UMPVRJIQHIYFBZTP53CXNM.jpg",
            "publishedAt": "2022-04-11T08:35:00Z",
            "content": "April 11 (Reuters) - Twitter Inc (TWTR.N) said on Sunday that Elon Musk rejected its offer to join the social media firm's board, a dramatic turn in a week when the billionaire became its biggest sha… [+3013 chars]"
        },
        {
            "source": {
                "id": "independent",
                "name": "Independent"
            },
            "author": "Louis Chilton",
            "title": "Chris Rock jokes ‘I got my hearing back’ after Will Smith banned from Oscars for slap - The Independent",
            "description": "‘I’m OK. I’m not talking about it until I get paid,’ the comedian also reportedly said, during a gig in California on Friday night",
            "url": "https://www.independent.co.uk/arts-entertainment/films/news/chris-rock-will-smith-oscar-ban-b2055240.html",
            "urlToImage": "https://static.independent.co.uk/2022/04/09/15/pjimage%20-%202022-04-09T150510.229.jpg?quality=75&width=1200&auto=webp",
            "publishedAt": "2022-04-11T05:25:47Z",
            "content": "Chris Rock reportedly addressed the incident with Will Smith at the 2022 Academy Awards during a stand-up set on Friday (8 April) night. \r\nEarlier that day, the Academy announced it would be banning … [+1217 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "hoopsrumors.com"
            },
            "author": null,
            "title": "NBA's Play-In Field, Top-Six Playoff Seeds Set - hoopsrumors.com",
            "description": "Here are the NBA's play-in matchups and each conference's top six seeds for 2021/22.",
            "url": "https://www.hoopsrumors.com/2022/04/nbas-play-in-tournament-field-schedule-is-set.html",
            "urlToImage": "https://cdn.hoopsrumors.com/files/2020/05/USATSI_10807867_168380616_lowres-900x600.jpg",
            "publishedAt": "2022-04-11T05:09:00Z",
            "content": "The NBA wrapped up its 2021/22 regular season on Sunday, and the teams and seeds for this year’s play-in tournament have been set. Here are the play-in matchups:\r\nEastern Conference\r\nTuesday, April 1… [+1901 chars]"
        },
        {
            "source": {
                "id": "business-insider",
                "name": "Business Insider"
            },
            "author": "Cheryl Teh",
            "title": "The 12 Most Powerful People in China You've Never Heard of - Business Insider",
            "description": "In the chess game of Chinese politics, it's not always clear who pulls the strings. Here are the 12 most influential people who hold the fate — and might — of a country of 1.4 billion people in their hands.",
            "url": "https://www.businessinsider.com/12-most-powerful-people-in-china-youve-never-heard-of-2022-3",
            "urlToImage": "https://i.insider.com/6234f65b683ded0019d27012?width=1200&format=jpeg",
            "publishedAt": "2022-04-11T04:54:15Z",
            "content": "You may not have heard the name Li Keqiang before but you likely soon will. \r\nThat's because when the Chinese premier steps down from power in March 2023, a decision he confirmed in March, it will tr… [+25093 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "ESPN"
            },
            "author": "Adrian Wojnarowski",
            "title": "Frank Vogel out as coach of Los Angeles Lakers after 3 seasons, sources say - ESPN",
            "description": "Frank Vogel has coached his final game with the Lakers, a decision expected to be shared with him as soon as Monday, sources told ESPN.",
            "url": "https://www.espn.com/nba/story/_/id/33716886/frank-vogel-coach-los-angeles-lakers-3-seasons-sources-say",
            "urlToImage": "https://a2.espncdn.com/combiner/i?img=%2Fphoto%2F2022%2F0411%2Fr998133_1296x729_16%2D9.jpg",
            "publishedAt": "2022-04-11T04:47:24Z",
            "content": "Frank Vogel, who led the Los Angeles Lakers to the 2020 NBA championship, has coached his final game for the organization, a decision expected to be shared with him as soon as Monday, sources told ES… [+2845 chars]"
        },
        {
            "source": {
                "id": "cnn",
                "name": "CNN"
            },
            "author": "By <a href=\"/profiles/travis-caldwell\">Travis Caldwell</a> and <a href=\"/profiles/jessie-yeung\">Jessie Yeung</a>, CNN",
            "title": "Russia invades Ukraine: Live updates - CNN",
            "description": "President Volodymyr Zelensky said Ukraine is \"ready\" for a major Russian offensive in the east of the country, as he accused Moscow of lying to deflect the blame for the war. \"They have destroyed the lives of millions,\" he said.",
            "url": "https://www.cnn.com/europe/live-news/ukraine-russia-putin-news-04-11-22/index.html",
            "urlToImage": "https://cdn.cnn.com/cnnnext/dam/assets/220410072111-02-russia-8-mile-convoy-satellite-super-tease.jpg",
            "publishedAt": "2022-04-11T04:00:00Z",
            "content": "Ukraines President Volodymyr Zelensky addressed his nation Sunday, calling Ukrainians the bravest people of the best country in the world.\r\nWe are coming to an end of another week,\" Zelensky said in … [+1717 chars]"
        },
        {
            "source": {
                "id": "axios",
                "name": "Axios"
            },
            "author": "Julia Shapero",
            "title": "Texas district attorney to drop murder charge against woman for \"self-induced abortion\" - Axios",
            "description": "Lizelle Herrera, 26, was arrested Thursday and charged with murder for causing \"the death of an individual by self-induced abortion.\"",
            "url": "https://www.axios.com/texas-self-induced-abortion-dropped-9ffc892b-8acc-40f1-b262-36621bac8b31.html",
            "urlToImage": "https://images.axios.com/-JaJ9H5ig6WlUO73bDtD76qioQI=/0x105:4215x2476/1366x768/2022/04/10/1649614186357.jpg",
            "publishedAt": "2022-04-11T03:34:55Z",
            "content": "A Texas district attorney announced Sunday his office will drop a murder charge against a woman for an alleged \"self-induced abortion.\"\r\nCatch up fast: Lizelle Herrera, 26, was arrested Thursday and … [+799 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "GameSpot"
            },
            "author": "Chris Pereira",
            "title": "Kingdom Hearts 4 Announced, Watch The First Trailer - GameSpot",
            "description": "Sora is back with a new look, and he's headed to a big city called Quadratum.",
            "url": "https://www.gamespot.com/articles/kingdom-hearts-4-announced-watch-the-first-trailer/1100-6502347/",
            "urlToImage": "https://www.gamespot.com/a/uploads/screen_kubrick/123/1239113/3962778-kh4_01_legal.jpg",
            "publishedAt": "2022-04-11T03:30:23Z",
            "content": "Square Enix has announced that development is underway on Kingdom Hearts IV, the next entry in the long-running Disney RPG series. The news came as part of a 20th-anniversary celebration event and in… [+1308 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "Investing.com"
            },
            "author": "Reuters",
            "title": "Asia shares slip ahead of ECB meeting, US inflation test By Reuters - Investing.com",
            "description": "Asia shares slip ahead of ECB meeting, U.S. inflation test",
            "url": "https://www.investing.com/news/stock-market-news/asia-wary-ahead-of-ecb-meeting-us-inflation-data-2801328",
            "urlToImage": "https://i-invdn-com.investing.com/news/LYNXMPEA7D094_L.jpg",
            "publishedAt": "2022-04-11T03:10:00Z",
            "content": "By Wayne Cole\r\nSYDNEY (Reuters) - Asian shares slipped on Monday ahead of a week packed with central bank meetings and U.S. inflation data, while the euro eked out a gain on relief the far right did … [+3650 chars]"
        },
        {
            "source": {
                "id": "axios",
                "name": "Axios"
            },
            "author": "Rebecca Falconer",
            "title": "US: Russia \"planned\" attacks on Ukraine civilians - Axios",
            "description": "\"The larger issue of broad-scale war crimes and atrocities in Ukraine lies at the feet of ... the Russian president,\" Jake Sullivan said.",
            "url": "https://www.axios.com/us-russia-planned-ukraine-civilian-attacks-d3960e7c-8f8a-4831-b83a-0b9d671aa3b7.html",
            "urlToImage": "https://images.axios.com/ky_UlMm7HkjXdEn-SwLCw6iaS7Y=/1170x184:7483x3735/1366x768/2022/04/11/1649640228123.jpg",
            "publishedAt": "2022-04-11T02:34:56Z",
            "content": "National security adviser Jake Sullivan told ABC's \"This Week\" Sunday that U.S. intelligence indicated \"there was a plan from the highest levels of the Russian government\" for its forces to commit at… [+2303 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "KCCI Des Moines"
            },
            "author": null,
            "title": "2 people are dead and 10 hospitalized after nightclub shooting in Cedar Rapids, Iowa - KCCI Des Moines",
            "description": "Police did not release any information about possible suspects or arrests.",
            "url": "https://www.kcci.com/article/2-people-are-dead-and-10-hospitalized-after-nightclub-shooting-in-cedar-rapids-iowa/39683671",
            "urlToImage": "https://kubrick.htvapps.com/vidthumb/ba23bc9d-682d-4cd1-bac3-20db9eae9c8e/thumb_640x360_00001_1649598944_95980.jpg?crop=1xw:1xh;center,top&resize=1200:*",
            "publishedAt": "2022-04-11T02:32:00Z",
            "content": "CEDAR RAPIDS, Iowa —Two people were killed and about 10 others injured in a shooting at a Cedar Rapids, Iowa, nightclub early Sunday morning, police said.\r\nThe shooting happened just before 1:30 a.m.… [+2029 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "BBC News"
            },
            "author": "https://www.facebook.com/bbcnews",
            "title": "French elections: Macron and Le Pen to fight for presidency - BBC.com",
            "description": "Emmanuel Macron wins the first round, but the run-off against his far-right rival may be far closer.",
            "url": "https://www.bbc.com/news/world-europe-61061230",
            "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_news/175E9/production/_124112759_macronwin.jpg",
            "publishedAt": "2022-04-11T02:24:32Z",
            "content": "By Paul KirbyBBC News, Paris\r\nMedia caption, Watch: Emmanuel Macron says he will unite \"all the different convictions and beliefs\" if re-elected\r\nEmmanuel Macron has won the first round of the French… [+4835 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "SciTechDaily"
            },
            "author": null,
            "title": "NASA's Latest Plans for Critical Artemis I Moon Rocket Testing - SciTechDaily",
            "description": "NASA is planning to proceed with a modified wet dress rehearsal, primarily focused on tanking the core stage, and minimal propellant operations on the interim cryogenic propulsion stage (ICPS) with the ground systems at Kennedy. Due to the changes in loading …",
            "url": "https://scitechdaily.com/nasa-latest-plans-for-critical-artemis-i-moon-rocket-testing/",
            "urlToImage": "https://scitechdaily.com/images/NASA-SLS-and-SpaceX-Falcon-9-at-Launch-Complex-39A-39B-scaled.jpg",
            "publishedAt": "2022-04-11T02:07:44Z",
            "content": "NASA’s Space Launch System (SLS) rocket with the Orion spacecraft aboard is seen atop a mobile launcher at Launch Complex 39B as the Artemis I launch team prepares for the next attempt of the wet dre… [+2461 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "Cointelegraph"
            },
            "author": "Brian Newar",
            "title": "Coinbase suspends crypto payment services days after India launch - Cointelegraph",
            "description": "Coinbase crypto exchange has suspended buy order service on its Indian arm due to pressure from local payment authorities. The NPCI stated it was unaware that a crypto exchange was using its exclusive payment interface to facilitate buy orders.",
            "url": "https://cointelegraph.com/news/coinbase-suspends-crypto-payment-services-days-after-india-launch",
            "urlToImage": "https://images.cointelegraph.com/images/1200_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjItMDQvMGMxZTgzYzItNzdjZS00ZTIyLTg3NTMtYzJmNjY5NDE5ZDA0LmpwZw==.jpg",
            "publishedAt": "2022-04-11T02:01:24Z",
            "content": "The largest US-based crypto exchange Coinbase has stopped payment services through United Payments Interface (UPI) on its platform for Indian users just three days after its launch in the South Asian… [+2772 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "CBS Sports"
            },
            "author": "",
            "title": "2022 Masters: Scottie Scheffler's cool head ignites historic hot streak, career-making run to green jacket - CBS Sports",
            "description": "Scheffler figured out the formula to winning on the PGA Tour, capturing four titles, including a major, in 57 days",
            "url": "https://www.cbssports.com/golf/news/2022-masters-scottie-schefflers-cool-head-ignites-historic-hot-streak-career-making-run-to-green-jacket/",
            "urlToImage": "https://sportshub.cbsistatic.com/i/r/2022/04/11/d199fe30-3138-4144-964d-2b8b64a9ae99/thumbnail/1200x675/6b8057a4317b4a1d47c65f79bd867d3f/scottie-scheffler-relief-masters-2022-g.jpg",
            "publishedAt": "2022-04-11T02:00:00Z",
            "content": "AUGUSTA, Ga. -- Most Masters champions begin crying the moment they slip on the green jacket. Scottie Scheffler wept shortly after waking up Sunday morning before the final round even started.\r\nSchef… [+8551 chars]"
        },
        {
            "source": {
                "id": "cnn",
                "name": "CNN"
            },
            "author": "Dakin Andone and Samantha Beech, CNN",
            "title": "New York City Mayor Eric Adams tests positive for Covid-19, spokesperson says - CNN",
            "description": "New York City Mayor Eric Adams tested positive for Covid-19 on Sunday, according to a statement from a spokesperson.",
            "url": "https://www.cnn.com/2022/04/10/us/mayor-eric-adams-covid-19-positive/index.html",
            "urlToImage": "https://cdn.cnn.com/cnnnext/dam/assets/220410135834-eric-adams-0404-restricted-super-tease.jpg",
            "publishedAt": "2022-04-11T01:58:00Z",
            "content": "(CNN)New York City Mayor Eric Adams tested positive for Covid-19 on Sunday, according to a statement from a spokesperson. \r\n\"This morning, Mayor Adams woke up with a raspy voice and, out of an abunda… [+2087 chars]"
        },
        {
            "source": {
                "id": "fox-news",
                "name": "Fox News"
            },
            "author": "Jon Brown",
            "title": "Biden 'doesn't currently have any plans' to travel to Ukraine despite Boris Johnson visit, WH says - Fox News",
            "description": "National security adviser Jake Sullivan said Sunday that President Biden has no plans to visit Ukraine, despite a recent visit to the country from U.K. Prime Minister Boris Johnson.",
            "url": "https://www.foxnews.com/politics/biden-doesnt-currently-have-plans-travel-ukraine-despite-boris-johnson-visit-wh-says",
            "urlToImage": "https://static.foxnews.com/foxnews.com/content/uploads/2022/03/AP22075644260226.jpg",
            "publishedAt": "2022-04-11T01:46:14Z",
            "content": "National security adviser Jake Sullivan said Sunday that President Biden has no plans to visit Ukraine, despite a recent visit to the country from U.K. Prime Minister Boris Johnson.\r\n\"It was quite th… [+2031 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "YouTube"
            },
            "author": null,
            "title": "27 states report rise in COVID infections in past 8 days - CBS Evening News",
            "description": "In California, COVID cases are up 78% in the last four days, but there has been no increase in the critical number of hospitalizations. Jonathan Vigliotti is...",
            "url": "https://www.youtube.com/watch?v=qRJXNGQrglQ",
            "urlToImage": "https://i.ytimg.com/vi/qRJXNGQrglQ/maxresdefault.jpg",
            "publishedAt": "2022-04-10T23:49:10Z",
            "content": null
        },
        {
            "source": {
                "id": "fox-news",
                "name": "Fox News"
            },
            "author": "Jon Brown",
            "title": "Palm Sunday sees thousands of Christians mark the triumphal entry in Jerusalem amid tensions - Fox News",
            "description": "Thousands of Christians in Jerusalem participated in celebrations to mark Palm Sunday, the day that begins Holy Week and commemorates when Jesus Christ made a triumphal entry into the city five days before Christians believe religious and civil authorities co…",
            "url": "https://www.foxnews.com/world/palm-sunday-christian-pilgrims-jerusalem-tensions",
            "urlToImage": "https://static.foxnews.com/foxnews.com/content/uploads/2022/04/GettyImages-1239896713.jpg",
            "publishedAt": "2022-04-10T23:33:03Z",
            "content": "Thousands of Christians in Jerusalem participated in celebrations to mark Palm Sunday, the day that begins Holy Week and commemorates when Jesus Christ made a triumphal entry into the city five days … [+2085 chars]"
        },
        {
            "source": {
                "id": "cbs-news",
                "name": "CBS News"
            },
            "author": "Scott Pelley",
            "title": "Volodymyr Zelenskyy's full 60 Minutes interview in Ukrainian - CBS News",
            "description": "As a service to Ukrainian speakers, we are posting the hour-long, April 7th interview in its entirety.",
            "url": "https://www.cbsnews.com/news/volodymyr-zelenskyy-full-ukrainian-60-minutes-interview-2022-04-10/",
            "urlToImage": "https://cbsnews3.cbsistatic.com/hub/i/r/2022/04/10/336e00bd-d45a-45cb-ab1f-072c489da27c/thumbnail/1200x630/7e5c6c90b2d7642b2de509dab2f4e9a4/zelenskygrabukrainian0.jpg",
            "publishedAt": "2022-04-10T23:32:00Z",
            "content": "Language translation is more art than science. Different translators have varied opinions of words and their meaning. For our interview with Ukrainian President Volodymyr Zelenskyy, we used the servi… [+699 chars]"
        }
    ]



    constructor() {
        super();
        console.log("i m  a constructor from news component")
        this.state = {
            articles: this.articles,
            loading: true
        }
    }


    async componentDidMount() {

        console.log("cdn");
        let url = "https://newsapi.org/v2/top-headlines?country=us&apiKey=00ee2d66e4fa482e9ed9cd132667cc65"
        let Data = await fetch(url);
        let parseData = Data.json()
        console.log(parseData);
        this.setState(articles, perseData, articles)


    }
    render() {
        return (
            <div className="container my-3">
                <h1> news monkey top head <h1>
                    <div className="row">
                        {this.state.articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} />
                            </div>
                        })}
                    </div>
                </div>
                    <div className="container">
                        <button type="button" class="btn btn-link">Previous</button>
                        <button type="button" class="btn btn-link">Next</button>
                    </div>
                    export default News