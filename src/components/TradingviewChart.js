/**
 * Created by jzheng on 7/31/17.
 */
import React from 'react'

class TradingviewChart extends React.Component {
    constructor(props) {
        super();
        this.state = {
            iFrameUrl: 'hi'
        };
        this.iframeUrlTemplate='new TradingView.widget({ "autosize": true, "symbol": "TICKER", "interval": "D", "timezone": "Etc/UTC", "theme": "White", "style": "1", "locale": "en", "toolbar_bg": "#f1f3f6", "enable_publishing": false, "allow_symbol_change": true, "hideideas": true, "studies": ["MACD@tv-basicstudies","StochasticRSI@tv-basicstudies","Volume@tv-basicstudies" ] })';
        this.iframeUrl = this.iframeUrlTemplate.replace("TICKER", props.ticker)
    }

    componentDidMount() {
        /*
        <script>
            {`new TradingView.widget({ "autosize": true, "symbol": "AAPL", "interval": "D", "timezone": "Etc/UTC", "theme": "White", "style": "1", "locale": "en", "toolbar_bg": "#f1f3f6", "enable_publishing": false, "allow_symbol_change": true, "hideideas": true, "studies": ["MACD@tv-basicstudies","StochasticRSI@tv-basicstudies","Volume@tv-basicstudies" ] });`}
        </script>
        */
        var headElem = document.getElementById('tradingview');
        var tradingWidgetInitCode = document.createElement('script');
        tradingWidgetInitCode.type = "text/javascript";
        tradingWidgetInitCode.innerHTML = this.iframeUrl;
        headElem.appendChild(tradingWidgetInitCode);
    }

    render() {
        return <script>
            {new TradingView.widget({ "autosize": true, "symbol": "AAPL", "interval": "D", "timezone": "Etc/UTC", "theme": "White", "style": "1", "locale": "en", "toolbar_bg": "#f1f3f6", "enable_publishing": false, "allow_symbol_change": true, "hideideas": true, "studies": ["MACD@tv-basicstudies","StochasticRSI@tv-basicstudies","Volume@tv-basicstudies" ] })}
        </script>
    }

}


export default TradingviewChart;