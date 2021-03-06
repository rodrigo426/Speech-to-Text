import React, { Component } from 'react';
import './App.css';
import styled from 'styled-components';
import recognizeMic from 'watson-speech/speech-to-text/recognize-microphone';
import image from './logo.png';

const Button = styled.button`
  background-color: #e7e7e7;
  border: none;
  color: #555555;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 15px;
  margin-bottom: 50px
  font-size: 24px;
  margin-top: 50px;`;

class App extends Component {
  constructor() {
    super()
    this.state = {}
  }
  onListenClick() {

    fetch('http://localhost:3002/api/speech-to-text/token')
      .then(function(response) {
          return response.text();
      }).then((token) => {
        console.log('token is', token)
        var stream = recognizeMic({
            token: token,
            model: 'pt-BR_BroadbandModel',
            objectMode: true, // send objects instead of text
            extractResults: true, // convert {results: [{alternatives:[...]}], result_index: 0} to {alternatives: [...], index: 0}
            format: false // optional - performs basic formatting on the results such as capitals an periods
        });
        stream.on('data', (data) => {
          this.setState({
            text: data.alternatives[0].transcript
          })
        });
        stream.on('error', function(err) {
            console.log(err);
        });
        document.querySelector('#stop').onclick = stream.stop.bind(stream);
      }).catch(function(error) {
          console.log(error);
      });
  }
  render() {
    return (

      <div className="App">
        <div className="logo"><img src={require("./logo.png")}/></div>
        <Button onClick={this.onListenClick.bind(this)}>Ouvir</Button>
        <div className='Texto'>{this.state.text}</div>
      </div>
    );
  }
}

export default App;