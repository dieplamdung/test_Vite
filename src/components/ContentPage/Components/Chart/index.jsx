/* eslint-disable no-irregular-whitespace */
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { widget } from '../../../../charting_library';
import RealTimeDataFeed from '../../../../utils/datafeed/RealTimeDataFeed';

const disabledFeatures = [
  'use_localstorage_for_settings',
  // 'timeframes_toolbar',
  // 'left_toolbar', // left sidebar
  'header_undo_redo', // ​​undo, redo button
  'header_fullscreen_button', // ​​full screen button
  // 'header_chart_type', // chart type button
  // 'header_screenshot', // screenshot button
  // 'header_symbol_search', // ​​head search button
  'header_compare', // ​​compare button
  // 'header_indicators', // ​​display indicator button
  // 'header_saveload', // ​​save, load button
  'header_settings', // setting button
  // 'header_widget_dom_node', // top toolbar
  // 'border_around_the_chart', // border surround
  'countdown', // countdown
  // 'compare_symbol',
  'symbol_info', // ​​product information
  // 'main_series_scale_menu',
  // 'study_dialog_search_control',
  'control_bar', // ​​associated with the navigation button at the bottom of the chart
  // 'hide_left_toolbar_by_default', // ​​hide the left toolbar when the user opens the chart for the first time
  'go_to_date' // ​​lower left date range
  // 'edit_buttons_in_legend',
];

const tradingViewConfig = {
  // debug: true,
  autosize: true,
  library_path: 'charting_library/',
  disabled_features: disabledFeatures,
  enabled_features: ['hide_left_toolbar_by_default'],
  studies_overrides: {
    'Overlay.candleStyle.upColor': '#00ff00',
    'Overlay.candleStyle.downColor': '#FF00CA',
    'Overlay.candleStyle.barColorsOnPrevClose': true
  },
  overrides: {
    'mainSeriesProperties.candleStyle.upColor': '#00ff00',
    'mainSeriesProperties.candleStyle.downColor': '#FF00CA',
    'mainSeriesProperties.candleStyle.borderColor': '#378658',
    'mainSeriesProperties.candleStyle.borderUpColor': '#00ff00',
    'mainSeriesProperties.candleStyle.borderDownColor': '#FF00CA',
    'mainSeriesProperties.candleStyle.wickUpColor': '#00ff00',
    'mainSeriesProperties.candleStyle.wickDownColor': '#FF00CA',
    'mainSeriesProperties.candleStyle.barColorsOnPrevClose': true,
    'paneProperties.backgroundType': 'solid',
    'paneProperties.background': '#0F1724',
    'paneProperties.vertGridProperties.color': 'transparent'
  },
  custom_css_url: './custom.css'
};

const timeMap = {
  '00:05:00': '5',
  '00:15:00': '15',
  '00:01:00': '1',
  '01:00:00': '60',
  '1.00:00:00': '1D'
};

const Chart = ({
  selectedCoin = 'BTC',
  durationSelected = '00:01:00',
  tickerType = 'moonrekt',
  theme = 'Dark'
}) => {
  const containerId = useRef(`tv_container_${Math.random().toString(36).substring(7)}`);

  useEffect(() => {
    if (window) {
      const feed = new RealTimeDataFeed(selectedCoin, tickerType);

      const interval = timeMap[durationSelected];

      const widgetOptions = {
        symbol: selectedCoin,
        datafeed: feed,
        interval,
        theme,
        container_id: containerId.current,
        ...tradingViewConfig,
        locale: 'pt'
      };

      let tvWidget = new widget(widgetOptions);
      // Cleanup
      return () => tvWidget?.remove();
    }
  }, [selectedCoin, durationSelected, tickerType, theme]);

  return (
    <WrapperChart>
      <div id={containerId.current} className="tradingview" />
    </WrapperChart>
  );
};

export default React.memo(Chart);

const WrapperChart = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  .tradingview {
    width: 100%;
    height: 100%;
  }
`;
