/*eslint-disable no-alert */
////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Using context, implement the <Form>, <SubmitButton>, and <TextInput>
// components such that:
//
// - Clicking the <SubmitButton> calls <Form onSubmit>
// - Hitting "Enter" while in a <TextInput> submits the form
// - Don't use a <form> element, we're intentionally recreating the
//   browser's built-in behavior
//
// Got extra time?
//
// - Send the values of all the <TextInput>s to the <Form onSubmit> handler
//   without using DOM traversal APIs
// - Implement a <ResetButton> that resets the <TextInput>s in the form
////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class Form extends React.Component {
  render() {
    return <div>{this.props.children}</div>
  }
}

class ResetButton extends React.Component {
  static contextTypes = {
    form: PropTypes.object,
  }
  render(){
    return <button onClick={this.context.form.handleReset}>Reset</button>
  }
}

class SubmitButton extends React.Component {
  static contextTypes = {
    form: PropTypes.object,
  }
  render() {
    return <button onClick={this.context.form.handleSubmit}>{this.props.children}</button>
  }
}

class TextInput extends React.Component {
  static contextTypes = {
    form: PropTypes.object,
  }

  componentDidMount() {
    this.context.form.updateForm(this.props.name, '')
  }

  render() {
    return (
      <input
        onKeyUp={(e) => {
          if(e.key === 'Enter'){ this.context.form.handleSubmit() }
        }}
        onChange={(e) => {
          this.context.form.updateForm(this.props.name, e.target.value)
        }}
        type="text"
        name={this.props.name}
        value={this.context.form.getFormValue(this.props.name)}
        placeholder={this.props.placeholder}
      />
    )
  }
}

class App extends React.Component {
  handleReset = () => {
    this.setState({
      formValues: {}
    })
  }

  handleSubmit = () => {
    alert(JSON.stringify(this.state.formValues))
  }

  updateForm = (key, value) => {
    const x = {
      formValues: {
        ...this.state.formValues,
        [key]: value,
      }
    }
    this.setState(x)
  }

  getFormValue = (key) => {
    return this.state.formValues[key] || ""
  }

  state = {
    formValues: {}
  }

  static childContextTypes = {
    form: PropTypes.shape({
      handleSubmit: PropTypes.func,
      updateForm: PropTypes.func,
      getFormValue: PropTypes.func,
      handleReset: PropTypes.func
    }).isRequired
  }

  getChildContext() {
    return {
      form: {
        handleSubmit: this.handleSubmit,
        updateForm: this.updateForm,
        getFormValue: this.getFormValue,
        handleReset: this.handleReset,
      }
    }
  }

  render() {
    return (
      <div>
        <h1>This isn't even my final <code>&lt;Form/&gt;</code>!</h1>

        <Form onSubmit={this.handleSubmit}>
          <p>
            <TextInput name="firstName" placeholder="First Name"/> {' '}
            <TextInput name="lastName" placeholder="Last Name"/>
          </p>
          <p>
            <SubmitButton>Submit</SubmitButton>
            <ResetButton />
          </p>
        </Form>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
