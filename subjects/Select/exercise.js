/*eslint-disable no-console */
////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Make this work like a normal <select> box!
////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './styles.css'

class Select extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    defaultValue: PropTypes.any
  }

  state = {
    showOptions: false,
    value: 'label',
  }

  toggleOptions = () => {
    this.setState({
      showOptions: !this.state.showOptions
    })
  }

  componentDidMount() {
    if(this.props.defaultValue) { this.setState({value: this.props.defaultValue}) }
  }

  getValue = () => {
    if(this.props.value) { return this.props.value }
    return this.state.value
  }

  updateValue = (value) => {
    this.setState({value})
  }

  close = () => {
    this.setState({showOptions: false})
  }

  render() {
    const children = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        onClick: (e) => {
          if(typeof this.props.onChange === 'function'){
            this.props.onChange(e)
          } else {
            this.updateValue(e)
          }
          this.close()
        }
      })
    })
    return (
      <div className="select">
        <span> {this.state.controlled} </span>
        <div onClick={this.toggleOptions} className="label">{this.getValue()} <span className="arrow">▾</span></div>
        {this.state.showOptions && <div className="options">
          {children}
        </div>}
      </div>
    )
  }
}

class Option extends React.Component {
  render() {
    return (
      <div onClick={() => this.props.onClick(this.props.value)} className="option">{this.props.children}</div>
    )
  }
}

class App extends React.Component {
  state = {
    selectValue: 'dosa',
    override: null
  }

  setToMintChutney = () => {
   this.setState({ selectValue: 'mint-chutney' })
  }

  render() {
    return (
      <div>
        <h1>Select/Option</h1>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>

        <h2>Controlled</h2>
        <p>
          <button onClick={this.setToMintChutney}>Set to Mint Chutney</button>
          <button onClick={() => this.setState({override: 'now i am controlled'})}> Override </button>
        </p>

        <Select
          value={this.state.selectValue}
          onChange={value => this.setState({ selectValue: value })}
        >
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>

        <h2>Uncontrolled</h2>
        <Select value={this.state.override} defaultValue="tikka-masala">
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
