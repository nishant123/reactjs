import { getByTitle } from '@testing-library/react'
import React, { Component } from 'react'

export class NewsItem extends Component {
    articles = [
        {
            "source": {
                "id": null,
                "name": "Fox Business"
            },
            "author": "Adam Sabes",
            "title": "Jeff Bezos responds to Elon Musk's poll asking if Twitter HQ should be converted into homeless shelter - Fox Business",
            "description": "Amazon founder Jeff Bezos responded to Elon Musk's Twitter poll asking if the social media giant's headquarters should be converted to a shelter for the homeless.",
            "url": "https://www.foxbusiness.com/economy/jeff-bezos-responds-to-elon-musks-poll-asking-if-twitter-hq-should-be-converted-into-homeless-shelter",
            "urlToImage": "https://a57.foxnews.com/static.foxbusiness.com/foxbusiness.com/content/uploads/2022/04/0/0/Musk-Twitter-stake.png?ve=1&tl=1",
            "publishedAt": "2022-04-11T00:53:10Z",
            "content": "Amazon founder Jeff Bezos responded to Elon Musk's Twitter poll asking if the social media giant's headquarters should be converted to a homeless shelter.\r\n\"Convert Twitter SF HQ to homeless shelter … [+2519 chars]"
        },
        {
            "source": {
                "id": "usa-today",
                "name": "USA Today"
            },
            "author": "Nancy Armour, USA TODAY",
            "title": "Scottie Scheffler wins first Masters title, continuing his spectacular season - USA TODAY",
            "description": "Scottie Scheffler won his first PGA Tour title two months ago. Now he's a major champion after winning the Masters at Augusta National.",
            "url": "https://www.usatoday.com/story/sports/2022/04/10/scottie-scheffler-wins-masters-first-major-title-augusta-national/9536138002/",
            "urlToImage": "https://www.gannett-cdn.com/presto/2022/04/10/USAT/dbabd034-7660-4194-850d-76df29700c23-green_jacket.jpg?auto=webp&crop=4345,2444,x113,y161&format=pjpg&width=1200",
            "publishedAt": "2022-04-11T00:43:40Z",
            "content": "AUGUSTA, Ga. — Scottie Scheffler found the perfect complement for his world No. 1 ranking.\r\nA green jacket.\r\nScheffler won the Masters by three strokes Sunday, a spectacular chip shot on No. 3 giving… [+3972 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "KCRA Sacramento"
            },
            "author": "KCRA Staff",
            "title": "Smoke from massive fire at port in Benicia seen for miles - KCRA Sacramento",
            "description": "A day after the fire started authorities said it was fully contained.",
            "url": "https://www.kcra.com/article/smoke-from-structure-fire-benicia-seen-from-fairfield/39681814",
            "urlToImage": "https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/structure-fire-1649543225.png?crop=0.854xw:1.00xh;0.112xw,0&resize=1200:*",
            "publishedAt": "2022-04-11T00:26:00Z",
            "content": "SOLANO COUNTY, Calif. —A large fire at port in Benicia was contained a day after it started, authorities said. Wind drove the smoke to be seen for miles.\r\nThe fire started on the 1200 block of Baysho… [+1180 chars]"
        },
        {
            "source": {
                "id": "the-washington-post",
                "name": "The Washington Post"
            },
            "author": "Taylor Telford, Annabelle Timsit, Bryan Pietsch, Julian Duplain",
            "title": "As war enters bloody new phase, Ukraine again calls for more weapons - The Washington Post",
            "description": "As battles tilt toward full-scale military confrontation on open terrain, Ukrainian officials are again calling for Western alliances to step up weapons supplies to help the country strengthen its position on the battlefield.",
            "url": "https://www.washingtonpost.com/national-security/2022/04/10/ukraine-russia-war-zelensky/",
            "urlToImage": "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/GWTLS6FY7II6ZKJNY5R55AMMEE.jpg&w=1440",
            "publishedAt": "2022-04-11T00:22:15Z",
            "content": "Russian forces bombarded several towns in eastern Ukraine on Sunday, destroying an airport and damaging several civilian targets, as the war careens toward a pivotal new phase. The shift of the war a… [+11553 chars]"
        },
        {
            "source": {
                "id": "reuters",
                "name": "Reuters"
            },
            "author": null,
            "title": "France's Macron and Le Pen head for cliffhanger April 24 election runoff - Reuters.com",
            "description": "French leader Emmanuel Macron and challenger Marine Le Pen qualified on Sunday for what promises to be a very tightly fought presidential election runoff on April 24, pitting a pro-European economic liberal against a far-right nationalist.",
            "url": "https://www.reuters.com/world/europe/macron-faces-tough-fight-france-votes-sunday-2022-04-10/",
            "urlToImage": "https://www.reuters.com/resizer/0jXhz4hUl8WbIyF--TuCfUzlIkw=/1200x628/smart/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/J2GPQJ5CUJO3FOBZC4X2NIBFPQ.jpg",
            "publishedAt": "2022-04-11T00:21:00Z",
            "content": "PARIS, April 10 (Reuters) - French leader Emmanuel Macron and challenger Marine Le Pen qualified on Sunday for what promises to be a very tightly fought presidential election runoff on April 24, pitt… [+4971 chars]"
        },
        {
            "source": {
                "id": "associated-press",
                "name": "Associated Press"
            },
            "author": "Michael Balsamo",
            "title": "Biden to nominate new ATF director, release ghost gun rule - The Associated Press",
            "description": "WASHINGTON (AP) — President Joe Biden is nominating an Obama-era U.S. attorney to run the Bureau of Alcohol, Tobacco, Firearms and Explosives, as his administration unveils its formal rule to rein in ghost guns, privately made firearms without serial numbers …",
            "url": "https://apnews.com/3ceca4c74b79b684231fbb6e8fc1bf0f",
            "urlToImage": "https://storage.googleapis.com/afs-prod/media/ddaf7b11e1c64a5c94de0af75deee75b/3000.jpeg",
            "publishedAt": "2022-04-11T00:11:15Z",
            "content": "WASHINGTON (AP) President Joe Biden is nominating an Obama-era U.S. attorney to run the Bureau of Alcohol, Tobacco, Firearms and Explosives, as his administration unveils its formal rule to rein in g… [+4511 chars]"
        },
        {
            "source": {
                "id": "the-wall-street-journal",
                "name": "The Wall Street Journal"
            },
            "author": "David Benoit",
            "title": "Bank Deposits Could Drop for First Time Since World War II - The Wall Street Journal",
            "description": "Analysts have been slashing expectations for bank deposits in recent weeks as Fed rate increases ripple through the industry",
            "url": "https://www.wsj.com/articles/bank-deposits-could-drop-for-first-time-since-world-war-ii-11649599205",
            "urlToImage": "https://images.wsj.net/im-521715/social",
            "publishedAt": "2022-04-10T23:57:00Z",
            "content": "U.S. banks have a streak of increasing deposits as a group every year since at least World War II. This year could break it.\r\nOver the past two months, bank analysts have slashed their expectations f… [+304 chars]"
        },
        {
            "source": {
                "id": "cnn",
                "name": "CNN"
            },
            "author": "By <a href=\"/profiles/joe-ruiz\">Joe Ruiz</a>, Maureen Chowdhury, Mike Hayes, <a href=\"/profiles/simone-mccarthy\">Simone McCarthy</a>, <a href=\"/profiles/brad-lendon\">Brad Lendon</a>, Rob Picheta and <a href=\"/profiles/laura-smith-spark\">Laura Smith-Spark</a>, CNN",
            "title": "Russia invades Ukraine: Live Updates - CNN",
            "description": "As Russia shifts its plans after failing to take Kyiv, President Vladimir Putin names Army Gen. Alexander Dvornikov to run the war for him, a US and a European official say",
            "url": "https://www.cnn.com/europe/live-news/ukraine-russia-putin-news-04-10-22/index.html",
            "urlToImage": "https://dynaimage.cdn.cnn.com/cnn/digital-images/org/5b1f401a-948b-4d06-a345-fc03cc622231.jpg",
            "publishedAt": "2022-04-10T23:55:00Z",
            "content": "Ukraines President Volodymyr Zelensky addressed his nation Sunday, calling Ukrainians the bravest people of the best country in the world.\r\nWe are coming to an end of another week,\" Zelensky said in … [+1723 chars]"
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
                "id": "cbs-news",
                "name": "CBS News"
            },
            "author": "Caitlin Yilek",
            "title": "Zelenskyy calls on U.S. and its allies to deliver more military aid now: \"It will be very hard for us to hold on\" - CBS News",
            "description": "The Ukrainian president says the West must step up military aid and stop fearing Russia.",
            "url": "https://www.cbsnews.com/news/volodymyr-zelenskyy-ukraine-russia-military-aid-60-minutes-2022-04-10/",
            "urlToImage": "https://cbsnews2.cbsistatic.com/hub/i/r/2022/04/10/f6fc8230-a51c-4976-a9d5-4ce9280413d9/thumbnail/1200x630/c6e808168508dcba2afbec0bb56a00f8/amm06557.jpg",
            "publishedAt": "2022-04-10T23:26:31Z",
            "content": "Ukrainian President Volodymyr Zelenskyy said he can't understand Russia's brutality during its invasion of Ukraine, and called for more aid immediately from the United States and its allies in order … [+4879 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "New York Times"
            },
            "author": "Michael S. Schmidt, Luke Broadwater",
            "title": "Jan. 6 Panel Has Evidence for Criminal Referral of Trump, but Splits on Sending - The New York Times",
            "description": "Despite concluding that it has enough evidence, the committee is concerned that making a referral to the Justice Department would backfire by politicizing the investigation into the Capitol riot.",
            "url": "https://www.nytimes.com/2022/04/10/us/politics/jan-6-trump-criminal-referral.html",
            "urlToImage": "https://static01.nyt.com/images/2022/04/10/us/10dc-capitol-1/merlin_196522143_f6df2c89-bb49-4e66-89cc-cf8b359c5934-facebookJumbo.jpg",
            "publishedAt": "2022-04-10T23:23:27Z",
            "content": "Those frustrations played out in public at a hearing this month, when Ms. Lofgren said: This committee is doing its job. The Department of Justice needs to do theirs.\r\nMs. Lofgren said she had not pl… [+1474 chars]"
        },
        {
            "source": {
                "id": "marca",
                "name": "Marca"
            },
            "author": "LW",
            "title": "Dwayne Haskins death, LIVE: Police reveal details of Haskins death - Marca English",
            "description": "After it was confirmed that Pittsburgh Steelers quarterback Dwayne Haskins died this Saturday morning after being hit by a vehicle, the NFL has reacted immediately to honor the pla",
            "url": "https://www.marca.com/en/nfl/pittsburgh-steelers/2022/04/09/6251b7d5268e3e09268b4618.html",
            "urlToImage": "https://phantom-marca.unidadeditorial.es/752d6640552ef650922b0ddd8249065e/resize/1200/f/jpg/assets/multimedia/imagenes/2022/04/09/16495223690720.jpg",
            "publishedAt": "2022-04-10T23:06:45Z",
            "content": "After it was confirmed that Pittsburgh Steelers quarterback Dwayne Haskins died this Saturday morning after being hit by a vehicle, the NFL has reacted immediately to honor the player.\r\nThe former Oh… [+13846 chars]"
        },
        {
            "source": {
                "id": "the-verge",
                "name": "The Verge"
            },
            "author": "Emma Roth",
            "title": "'Expired' digital PS Vita and PS3 games rendered unplayable - The Verge",
            "description": "Players on PS Vita and PS3 are unable to play certain games after an expiration date appeared on their games. The issue seems to mainly affect classic titles like Chrono Cross, Final Fantasy VI, and Chrono Trigger.",
            "url": "https://www.theverge.com/2022/4/10/23019235/playstation-digital-games-ps3-ps-vita-expiring-sony-chrono-trigger",
            "urlToImage": "https://cdn.vox-cdn.com/thumbor/qUY69I1_0SQ0eSjPE0BUYDKboTU=/0x146:2040x1214/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/19434204/vpavic_191205_untitled_0018_Edit.jpg",
            "publishedAt": "2022-04-10T22:12:05Z",
            "content": "Players are unable to play Chrono Cross, Chrono Trigger, Final Fantasy VI, and more\r\nPhoto by Vjeran Pavic / The Verge\r\nPlayers on PlayStation 3 and PlayStation Vita are having trouble accessing thei… [+2080 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "New York Times"
            },
            "author": "Giulia Heyward",
            "title": "Maryland Lawmakers Expand Abortion Access, Overriding Governor’s Veto - The New York Times",
            "description": "The new law allows trained medical professionals other than physicians to perform abortions and requires insurance providers to cover more costs.",
            "url": "https://www.nytimes.com/2022/04/10/us/maryland-abortion-rights-veto.html",
            "urlToImage": "https://static01.nyt.com/images/2022/04/10/multimedia/00maryland-abortion-2/00maryland-abortion-2-facebookJumbo.jpg",
            "publishedAt": "2022-04-10T22:03:25Z",
            "content": "Maryland is joining 14 other states in allowing trained medical professionals other than physicians to perform abortions. That change is part of a bill expanding abortion rights that was passed Satur… [+1002 chars]"
        },
        {
            "source": {
                "id": "fox-news",
                "name": "Fox News"
            },
            "author": "Bradford Betz",
            "title": "UK’s Boris Johnson, Ukraine's Zelenskyy seen walking defiantly down streets of Kyiv - Fox News",
            "description": "U.K. Prime Minister Boris Johnson and Ukrainian President Volodymyr Zelenskyy were widely praised on social media for their show of solidarity in the face of Russian aggression.",
            "url": "https://www.foxnews.com/world/uks-boris-johnson-zelenskyy-praised-for-video-showing-them-walking-defiantly-down-streets-of-kyiv",
            "urlToImage": "https://static.foxnews.com/foxnews.com/content/uploads/2022/04/Johnson-Zelenskyy.jpg",
            "publishedAt": "2022-04-10T21:47:43Z",
            "content": "U.K. Prime Minister Boris Johnson and Ukrainian President Volodymyr Zelenskyy were widely praised on social media for their show of solidarity in the face of Russian aggression. \r\nA video of Johnson,… [+2458 chars]"
        },
        {
            "source": {
                "id": "engadget",
                "name": "Engadget"
            },
            "author": "https://www.engadget.com/about/editors/igor-bonifacic",
            "title": "iOS 16 could include improved notifications and new health tracking features - Engadget",
            "description": "The next major release of Apple’s iOS operating system could include “significant enhancements,” according to Bloomberg’s Mark Gurman..",
            "url": "https://www.engadget.com/ios-16-notifications-overhaul-report-212743091.html",
            "urlToImage": "https://s.yimg.com/os/creatr-uploaded-images/2021-09/eb452190-1cfe-11ec-af5f-6db0f202f959",
            "publishedAt": "2022-04-10T21:28:09Z",
            "content": "The next major release of Apples iOS operating system could include significant enhancements, according to Bloombergs Mark Gurman. In his latest Power On\r\n newsletter, Gurman says he anticipates iOS … [+1223 chars]"
        },
        {
            "source": {
                "id": "cnn",
                "name": "CNN"
            },
            "author": "Paradise Afshar, Keith Allen",
            "title": "Texas district attorney says he will drop murder charge against woman in connection with 'self-induced abortion' - CNN",
            "description": "A Texas district attorney is filing a motion to dismiss a murder charge against a woman arrested last week in connection with what law enforcement called \"the death of an individual by self-induced abortion.\"",
            "url": "https://www.cnn.com/2022/04/10/us/texas-district-attorney-drops-murder-charge/index.html",
            "urlToImage": "https://media.cnn.com/api/v1/images/stellar/prod/220410160914-texas-district-attorney-drops-murder-charge.jpg?c=16x9&q=w_800,c_fill",
            "publishedAt": "2022-04-10T21:28:00Z",
            "content": "A Texas district attorney is filing a motion to dismiss a murder charge against a woman arrested last week in connection with what law enforcement called the death of an individual by self-induced ab… [+2715 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "ESPN"
            },
            "author": "Mark Ogden",
            "title": "Man City, Liverpool keep Premier League race open, but point more useful to Guardiola than Klopp - ESPN",
            "description": "Man City remain one point ahead of Liverpool after Sunday's showdown. Given each side's run-in, the champions should retain the title.",
            "url": "https://www.espn.com/soccer/english-premier-league/story/4638338/man-cityliverpool-keep-premier-league-race-openbut-point-more-useful-to-guardiola-than-klopp",
            "urlToImage": "https://a3.espncdn.com/combiner/i?img=%2Fphoto%2F2022%2F0410%2Fr997875_1296x729_16%2D9.jpg",
            "publishedAt": "2022-04-10T21:17:58Z",
            "content": "MANCHESTER, England -- It was epic, frenetic and unpredictable until the end, when Riyad Mahrez had a chance not only to win the game, but almost certainly the Premier League title. Instead, the Manc… [+6142 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "New York Post"
            },
            "author": "Mike Puma",
            "title": "Bullpen, Pete Alonso error cost Mets in loss to Nationals - New York Post ",
            "description": "Buck Showalter got two unused members of his bullpen involved Sunday as he had hoped, but the desired result didn’t follow.",
            "url": "https://nypost.com/2022/04/10/mets-bullpen-pete-alonso-error-cost-them-in-loss-to-nationals/",
            "urlToImage": "https://nypost.com/wp-content/uploads/sites/2/2022/04/Mets-Nationals-lose-bunt.jpg?quality=75&strip=all&w=1024",
            "publishedAt": "2022-04-10T20:55:00Z",
            "content": "WASHINGTON Buck Showalter got two unused members of his bullpen involved Sunday as he had hoped, but the desired result didnt follow.\r\nMost notably, Trevor Williams surrendered a pair of eighth-innin… [+2497 chars]"
        },
        {
            "source": {
                "id": null,
                "name": "Deadline"
            },
            "author": "Lynette Rice",
            "title": "Sam Elliott Apologizes For ‘Power Of The Dog’ Comments: “I Said Some Things That Hurt People And I Feel Terrible About That” - Deadline",
            "description": "EXCLUSIVE: Sam Elliott on Sunday apologized for the comments he made last month about the film The Power of the Dog on Marc Maron’s WTF podcast and had a special message for Jane Campion, who won the Oscar for directing the Western drama starring Benedict Cum…",
            "url": "https://deadline.com/2022/04/sam-elliott-apology-the-power-of-the-dog-comments-1234999185/",
            "urlToImage": "https://deadline.com/wp-content/uploads/2022/04/Sam-Elliott-Contenders-TV-e1649620705837.jpg?w=1024",
            "publishedAt": "2022-04-10T20:03:00Z",
            "content": "EXCLUSIVE:Sam Elliott on Sunday apologized for the comments he made last month about the film The Power of the Dog on Marc Maron’s WTF podcast and had a special message for Jane Campion, who won the … [+2667 chars]"
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

    render() {
        let { title, description, imageUrl, newsUrl } = this.props;
        return (
            <div className="my-3">
                <div className="card" style={{ width: "18rem" }} >
                    <img src={imageUrl} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">{title}...</h5>
                        <p className="card-text">{description}...</p>
                        <a href={newsUrl} target="_blank" className="btn btn-sm btn-primary">READ more...</a>
                    </div>
                </div>
            </div >
        )
    }
}

export default NewsItem