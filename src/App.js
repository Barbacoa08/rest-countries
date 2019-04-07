import React, { Component } from 'react'
import './App.css'
import axios from 'axios'

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
      <div className="App">
        <div>
          Countries count: {countriesCount}
        </div>
        <div>
          Countries that are islands count: {islandCountries.length}
          <div>{this.displayIslandCountryNames()}</div>
        </div>
        <div>
          <p>Countr{countriesWithMostBorderingCountries.length === 1 ? 'y' : 'ies'} with the most bordering countries count: {countriesWithMostBorderingCountries.length}</p>
          <div>{this.displayMostBorderingCountriesNames()}</div>
        </div>
      </div>
    )
  }

  // TODO: get a react table so we can pretty-print the names with the interesting info.
  displayIslandCountryNames() {
    const liArray = []
    this.state.islandCountries.forEach((country, index) =>
      liArray.push(<li key={`island-country-${index}`}>{country.name}</li>)
    )
    return (
      <ul>{liArray}</ul>
    )
  }

  // TODO: get a react table so we can pretty-print the names with the interesting info.
  displayMostBorderingCountriesNames() {
    const liArray = []
    this.state.countriesWithMostBorderingCountries.forEach((country, index) =>
      liArray.push(<li key={`bordering-country-${index}`}>{country.name}</li>)
    )
    return (
      <ul>{liArray}</ul>
    )
  }

  // TODO: runner up? table of one is kinda boring...
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
      // eg, ignore countries that have multiple "territorial claims" such as Antarctica
      country.borders.length === 0 && !!country.capital)
  }
}

export default App
