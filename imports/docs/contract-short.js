import React from 'react';

export default contractShort = () => {
  return (
    <html>
        <head>
          <meta charSet="utf8"/>
          <title>SuitArt Business Card</title>
        </head>
        <body>
          <div className="page">
            <div className="bottom">
              <div className="line">Marc Bachmann</div>
              <div className="line">cto</div>
              <div className="group">
                <div className="line">p: 41 00 000 00 00</div>
                <div className="line">github: marcbachmann</div>
              </div>
              <div className="group">
                <div className="line">suitart ag</div>
                <div className="line">räffelstrasse 25</div>
                <div className="line">8045 zürich</div>
              </div>
            </div>
          </div>
          <div className="page">
            <img className="logo" src="{{image}}"/>
            <div className="bottom">
                <div className="line center">8045 zürich</div>
            </div>
          </div>
        </body>
      </html>
  )
}