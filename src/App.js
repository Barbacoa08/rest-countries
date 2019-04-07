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
      countriesWithMostBorderingCountries: this.getMostBorderingCountries(result),
    })
  }

  render() {
    const { countriesCount } = this.state

    return (
      <div className='app'>
        <h1>
          Countries count: {countriesCount}
        </h1>

        {this.displayTabs()}
      </div>
    )
  }

  displayBorderingCountriesData() {
    const { countriesWithMostBorderingCountries } = this.state

    let result = null
    if (countriesWithMostBorderingCountries.length > 1) {
      result = (<div>
        <h2>
          {countriesWithMostBorderingCountries.map(country => country.name).join(', ')}
        </h2>
        <ReactTable
          data={countriesWithMostBorderingCountries}
          columns={[
            { Header: 'Name', accessor: 'name' },
            { Header: 'Capital', accessor: 'capital' },
            { Header: 'Population', accessor: 'population' },
            {
              Header: 'Bordering Countries',
              accessor: 'borders',
              Cell: data => `${data.original.name} has ${data.value.length} bordering countries`
            },
          ]}
        />
      </div>)
    } else if (countriesWithMostBorderingCountries.length === 1) {
      const country = countriesWithMostBorderingCountries[0]
      result = (<div>
        <h2>{country.name}</h2>
        <div className='flex-row-container'>
          <div className='flex-row-item'>Capital</div>
          <div className='flex-row-item'>{country.capital}</div>

          <div className='flex-row-item'>Population</div>
          <div className='flex-row-item'>{country.population}</div>

          <div className='flex-row-item'>Languages</div>
          <div className='flex-row-item'>{this.getLanguageText(country.languages)}</div>
        </div>
      </div>)
    } else {
      result = (<h2>No data</h2>)
    }
    return result
  }

  displayTabs() {
    const {
      countriesCount,
      countriesWithMostBorderingCountries,
      islandCountries,
    } = this.state

    const borderingCountriesTabText = countriesWithMostBorderingCountries.length === 1
      ? `Country with the most bordering countries: ${countriesWithMostBorderingCountries[0].name}`
      : 'Tied between multiple, click for details'

    return countriesCount < 1
      ? (<div>No data available</div>)
      : (<Tabs>
        <TabList>
          <Tab>Countries that are islands count: {islandCountries.length}</Tab>
          <Tab>{borderingCountriesTabText}</Tab>
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
          {this.displayBorderingCountriesData()}
        </TabPanel>
      </Tabs>)
  }

  getMostBorderingCountries(countryList) {
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

    // TEST, for multiple countries with most bordering countries: borderingCountries[mostBorderingCountries].push(countryList[0])
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
