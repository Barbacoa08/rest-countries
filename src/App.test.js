import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })

import { mount } from 'enzyme'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)

  expect(mount(<App />)).toBeTruthy()
})

describe('<App />', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<App />)
  })

  it('handles call getMostBorderingCountries with zero countries passed', () => {
    expect(wrapper.instance().getMostBorderingCountries([])).toHaveLength(0)
  })

  it('handles call getMostBorderingCountries with many countries passed', () => {
    const manyCountries = [
      { borders: [1, 2, 3] },
      { borders: [1, 2, 3] },
      { borders: [1, 2, 3] },
      { borders: [1, 2, 3] },
      { borders: [1, 2, 3] },
    ]
    expect(wrapper.instance().getMostBorderingCountries(manyCountries)).toHaveLength(5)

    const differentBorderLengths = [
      { borders: [1] },
      { borders: [] },
      { borders: [1, 2] },
      { borders: [1, 2, 3] },
      { borders: [1, 2, 3, 4] },
      { borders: [1, 2, 3, 4] },
      { borders: [1, 2, 3] },
    ]
    expect(wrapper.instance().getMostBorderingCountries(differentBorderLengths)).toHaveLength(2)
  })

  it('handles call getIslandCountries with zero countries passed', () => {
    expect(wrapper.instance().getIslandCountries([])).toHaveLength(0)
  })

  it('handles call getIslandCountries with many countries passed', () => {
    const manyCountries = [
      { borders: [1, 2, 3] },
      { borders: [1, 2, 3] },
      { borders: [1, 2, 3] },
      { borders: [1, 2, 3] },
      { borders: [1, 2, 3] },
    ]
    expect(wrapper.instance().getIslandCountries(manyCountries)).toHaveLength(0)

    const differentBorderLengths = [
      { borders: [1], capital: `doesn't matter` },
      { borders: [], capital: 'sort of matters' },
      { borders: [1, 2], capital: `doesn't matter` },
      { borders: [1, 2, 3], capital: `doesn't matter` },
      { borders: [1, 2, 3, 4], capital: `doesn't matter` },
      { borders: [1, 2, 3, 4], capital: `doesn't matter` },
      { borders: [1, 2, 3], capital: `doesn't matter` },
    ]
    expect(wrapper.instance().getIslandCountries(differentBorderLengths)).toHaveLength(1)
  })

  it('handles call getLanguageText with good data passed', () => {
    const countryName = 'nameyname name'
    expect(wrapper.instance().getLanguageText({
      value: [{ name: countryName }]
    })).toContain(countryName)

    const twoLanguages = [{ name: 'not important 1' }, { name: 'not important 2' }]
    expect(wrapper.instance().getLanguageText({
      value: twoLanguages
    })).toContain(twoLanguages.length.toString())

    const manyLanguages = [
      { name: 'not important 1' },
      { name: 'not important 2' },
      { name: 'not important 3' },
      { name: 'not important 4' },
      { name: 'not important 5' },
      { name: 'not important 6' },
      { name: 'not important 7' },
      { name: 'not important 8' },
    ]
    const resultString = wrapper.instance().getLanguageText({
      value: manyLanguages,
      original: { name: countryName }
    })
    expect(resultString).toContain(manyLanguages.length.toString())
    expect(resultString).toContain(countryName)
  })

  it('handles call getLanguageText with bad data passed', () => {
    expect(wrapper.instance().getLanguageText()).toBe('Whoops, there was an error')
  })
})
