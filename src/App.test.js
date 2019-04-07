import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})

it('handles call getCountriesWithMostBorderingCountries with zero countries passed', () => {
  // TODO
})

it('handles call getCountriesWithMostBorderingCountries with many countries passed', () => {
  // TODO
})

it('handles call getIslandCountries with zero countries passed', () => {
  // TODO
})

it('handles call getIslandCountries with many countries passed', () => {
  // TODO
})

it('handles call getLanguageText with good data passed', () => {
  // TODO
})

it('handles call getLanguageText with bad data passed', () => {
  // TODO
})
