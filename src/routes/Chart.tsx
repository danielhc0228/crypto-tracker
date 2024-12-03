import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts"
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atom";

interface IHistoricalLine {
  time_open: string;
  time_close: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface IHistoricalCandle {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: number;
  market_cap: number;
}

interface ChartProps {
  coinId: string;
}

interface ICandleChartItem {
  x: Date;
  y: number[];
}

function Chart({coinId}: ChartProps) {
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading: isLoadingLine, data: dataLine } = useQuery<IHistoricalLine[]>(
    ["ohclv-line", coinId],
    () => fetchCoinHistory(coinId),
    { refetchInterval: 30000 }
  );
  
  const { isLoading: isLoadingCandle, data: dataCandle } = useQuery<IHistoricalCandle[]>(
    ["ohclv-candle", coinId],
    () => fetchCoinHistory(coinId),
    { refetchInterval: 30000 }
  );
  
    return <>
    <div>
      {isLoadingLine ? "Loading..." : 
      <ApexChart
      type="line"
      series={[
        {
          name: "Price",
          data: dataLine?.map((price) => price.close) as number[],
        },
      ]}
      options={{
        theme: {
          mode: isDark ? "dark" : "light",
        },
        chart: {
          height: 300,
          width: 500,
          toolbar: {
            show: false,
          },
          background: "transparent",
        },
        grid: { show: false },
        stroke: {
          curve: "smooth",
          width: 4,
        },
        yaxis: {
          show: false,
        },
        xaxis: {
          labels: { show: false },
          type: "datetime",
          categories: dataLine?.map((price) =>
            new Date(price.time_close * 1000).toISOString()
            ),
        },
        fill: {
          type: "gradient",
          gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
        },
        colors: ["#0fbcf9"],
        tooltip: {
          y: {
            formatter: (value) => `$${value.toFixed(2)}`,
          },
        },
      }}
      />
    }
      
    </div>
    <div>
    {isLoadingCandle ? "Loading..." : 
    <ApexChart
          type="candlestick"
          series={[
            {
              name: "Price",
              data: dataCandle?.map((props) => {
                return {
                  x: new Date(props.time_open * 1000),
                  y: [
                    parseFloat(props.open),
                    parseFloat(props.high),
                    parseFloat(props.low),
                    parseFloat(props.close),
                  ],
                };
              }) as ICandleChartItem[],
            },
          ]}
          options={{
            theme: {
              mode: "dark",
            },
            chart: {
              height: 300,
              width: 500,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            grid: {
              show: false,
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              labels: {
                show: false,
              },
              type: "datetime",
            },
            plotOptions: {
              candlestick: {
                colors: {
                  upward: "#ff009d",
                  downward: "#0be881",
                },
              },
            },
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
          }}
        />
    }
    </div>
    </>
  }
  export default Chart;