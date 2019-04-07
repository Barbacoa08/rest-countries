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

  displayIslandCountryNames() {
    const liArray = []
    this.state.islandCountries.forEach((country, index) =>
      liArray.push(<li key={`island-country-${index}`}>{country.name}</li>)
    )
    return (
      <ul>{liArray}</ul>
    )
  }

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
    // TODO: fact check, there could be countries with no bordering countries
    // that are not fully surrounded by water.
    return countryList.filter(country => country.borders.length === 0)
  }
}

export default App
