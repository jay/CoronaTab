import { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Place } from '../../../../shared/places'
import { DataApi } from '../../utils/api/data'
import { DashboardStatsComponent } from './stats'
import { LoadingComponent } from '../loading'
import { DashboardDailyChartComponent, DashboardCumulativeGraphComponent } from './graphs'

interface Props {
  place: Place
}

export enum LoadingStatus {
  IS_LOADING = 'isLoading',
  HAS_LOADED = 'hasLoaded',
  HAS_ERRORED = 'hasErrored'
}

interface State {
  loadingStatus: LoadingStatus
  rawData: any[]
  cumulativeSeriesData: any[]
  dailySeriesData: any[]
}

export class DashboardSelectedPlaceComponent extends Component<Props, State> {
  state: State = {
    loadingStatus: LoadingStatus.IS_LOADING,
    rawData: null,
    cumulativeSeriesData: null,
    dailySeriesData: null
  }

  componentDidMount () {
    this.fetchData()
  }

  componentDidUpdate (prevProps: Props) {
    if (prevProps.place.id !== this.props.place.id) {
      this.setState({
        rawData: null,
        cumulativeSeriesData: null,
        dailySeriesData: null
      })
      this.fetchData()
    }
  }

  fetchData = async () => {
    try {
      this.setState({ loadingStatus: LoadingStatus.IS_LOADING })
      const { data: rawData } = await DataApi.query({ placeId: this.props.place.id })
      if (!Array.isArray(rawData)) throw new Error('rawData is not an array')
      const cumulativeSeriesData = this.parseCumulativeSeriesData(rawData)
      const dailySeriesData = this.calcDailySeriesData(rawData)
      this.setState({
        rawData,
        cumulativeSeriesData,
        dailySeriesData,
        loadingStatus: LoadingStatus.HAS_LOADED
      })
    } catch (err) {
      this.setState({ loadingStatus: LoadingStatus.HAS_ERRORED })
    }
  }

  parseCumulativeSeriesData (rawData: any[]) {
    return rawData.map(([date, cases, deaths, recovered]) => ({
      date,
      cases,
      deaths,
      recovered
    }), [])
  }

  calcDailySeriesData (rawData) {
    return rawData
      .reduce((_data, [date, cases, deaths, recovered]) => {
        const yesterday = _data[_data.length - 1]
        return [
          ..._data,
          {
            date,
            cases: cases - yesterday.cases,
            deaths: deaths - yesterday.deaths,
            recovered: recovered - yesterday.recovered
          }
        ]
      }, [{ cases: 0, deaths: 0, recovered: 0 }])
      .filter(({ date }) => typeof date === 'string')
  }

  render () {
    return (
      <div className="dashboard-selected-place">
        {
          (() => {
            switch (this.state.loadingStatus) {
              case LoadingStatus.HAS_LOADED:
                return (
                  <>
                    <DashboardStatsComponent
                      title="Region Stats"
                      rawData={this.state.rawData}
                    />

                    <Tabs>
                      <TabList>
                        <Tab>Cumulative</Tab>
                        <Tab>Daily</Tab>
                      </TabList>
                      <TabPanel>
                        <div className="w-full" style={{ height: '300px', maxHeight: '300px'}}>
                          <DashboardCumulativeGraphComponent data={this.state.cumulativeSeriesData} />
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <div className="w-full" style={{ height: '300px', maxHeight: '300px'}}>
                          <DashboardDailyChartComponent data={this.state.dailySeriesData} />
                        </div>
                      </TabPanel>
                    </Tabs>

                    {/*<div className="region-comparison-select">
                      Compare your region with...
                        <select>
                          <option>There</option>
                        </select>
                    </div>*/}
                  </>
                )
              case LoadingStatus.HAS_ERRORED:
                return (
                  <div>
                    <button onClick={this.fetchData}>
                      Try again
                    </button>
                  </div>
                )
              case LoadingStatus.IS_LOADING:
                return (
                  <div>
                    <LoadingComponent className="h-10" />
                  </div>
                )
            }
          })()
        }

      </div>
    )
  }
}
