import React, { Component } from 'react'
import ReactTable from 'react-table'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-table/react-table.css'
import axios from 'axios'
import 'react-tabs/style/react-tabs.css'

import './App.css'

class App extends Component {
  constructor() {
    super()
    this.state = {
      countriesCount: 0,
      islandCountries: [],
      countriesWithMostBorderingCountries: [],
    }
  }

  async componentDidMount() {
    const result = (await axios.get('https://restcountries.eu/rest/v2/all')).data
    this.setState({
      countriesCount: result.length,
      islandCountries: this.getIslandCountries(result),
      countriesWithMostBorderingCountries: this.getCountriesWithMostBorderingCountries(result),
    })
  }

  render() {
    const {
      countriesCount,
      islandCountries,
      countriesWithMostBorderingCountries,
    } = this.state

    // NOTE: assuming zero down time of service
    return (
      <div className='App'>
        <h1>
          Countries count: {countriesCount}
        </h1>

        <Tabs>
          <TabList>
            <Tab>Countries that are islands count: {islandCountries.length}</Tab>
            <Tab>Countr{countriesWithMostBorderingCountries.length === 1 ? 'y' : 'ies'} with the most bordering countries count: {countriesWithMostBorderingCountries.length}</Tab>
          </TabList>

          <TabPanel>
            <ReactTable
              data={islandCountries}
              columns={[
                { Header: 'Name', accessor: 'name' },
                { Header: 'Capital', accessor: 'capital' },
                { Header: 'Population', accessor: 'population' },
                { Header: 'Notes', accessor: 'languages', Cell: this.getLanguageText, minWidth: 200 }
              ]}
            />
          </TabPanel>

          <TabPanel>
            <ReactTable
              data={countriesWithMostBorderingCountries}
              columns={[
                { Header: 'Name', accessor: 'name' },
                { Header: 'Capital', accessor: 'capital' },
                { Header: 'Population', accessor: 'population' },
              ]}
            />
          </TabPanel>
        </Tabs>
      </div>
    )
  }

  // TODO: getBorderingCountries and make a table that shows key(border countries count)-value(bordering country names)
  getCountriesWithMostBorderingCountries(countryList) {
    const borderingCountries = { 1: [] }
    let mostBorderingCountries = 1
    countryList.forEach(country => {
      if (country.borders.length > mostBorderingCountries) {
        mostBorderingCountries = country.borders.length
        borderingCountries[mostBorderingCountries] = []
      }
      if (country.borders.length === mostBorderingCountries) {
        borderingCountries[mostBorderingCountries].push(country)
      }
    })

    return borderingCountries[mostBorderingCountries]
  }

  getIslandCountries(countryList) {
    // NOTE: 53? not 80? http://www.funtrivia.com/askft/Question124008.html
    return countryList.filter(country =>
      // only get countries that have zero bordering countries and do have a capital
      // eg, ignore countries that have multiple 'territorial claims' such as Antarctica
      country.borders.length === 0 && !!country.capital)
  }

  getLanguageText(data) {
    let result = 'Whoops, there was an error'
    if (!data || !data.value || !data.value.length) return result

    if (data.value.length < 1) {
      result = 'How this country gets by without any languages is just strange...'
    } else if (data.value.length === 1) {
      result = `This countries primary language is ${data.value[0].name}.`
    } else if (data.value.length < 4) {
      result = `This country boasts ${data.value.length} primary languages.`
    } else {
      result = `${data.original.name} has ${data.value.length} primary languages!?`
    }
    return result
  }
}

export default App
