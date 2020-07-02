import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import * as speech from '@tensorflow-models/speech-commands';
import { Reduction } from '@tensorflow/tfjs';

export default class App extends React.Component {

  url = "https://teachablemachine.withgoogle.com/models/wtgUsMu_O";

  state = {
    shots: 0,
    score: {
      shot: 0,
      backgroundNoise: 0
    }
  }


  createModel = async () => {
    const checkpointURL = this.url + "/model.json";
    const metadataURL = this.url +  "/metadata.json";

    const recognizer = speech.create(
      "BROWSER_FFT",
      undefined,
      checkpointURL,
      metadataURL);

    await recognizer.ensureModelLoaded().catch(err => console.log(err));

    return recognizer;
  }

  onPressRecord = async () => {
    try {

      let recognizer = await this.createModel();

      const classLabels = recognizer.wordLabels(); // get class labels
      console.log('Recognzier', recognizer);
      recognizer.listen(async (result: any) => {
        const scores = Array.from(result.scores);
        console.log(this.state.shots);
        this.setState({
          shots: this.state.shots + 1
        });
      },
        { probabilityThreshold: 0.90 }).catch(err => console.log(err));
    } catch (e) {
      throw e;
      console.log('error', e);
    }
  }

  render() {
    return (
      <View style={styles.content}>
        
        <Text style={styles.titleText}>
          Contador de Tiros por Áudio
        </Text>

        <View>
        <Text style={styles.counterNumber}>
          {this.state.shots}
        </Text>
        <Text style={styles.counterText}>
          Tiros
        </Text>
        </View>
        
        <View style={styles.buttonRecord}>
          <Button
            onPress={this.onPressRecord}
            title="Iniciar Contagem"
            color="#841584"
            accessibilityLabel="Botão para captura de áudio de tiros"/>
        </View>

        <Text style={styles.description}>
          {`Experimento para contagem de tiros por áudio`}
        </Text>

        <Text style={styles.author}>
          Por Ahlan Guarnier, 2020 
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "black",
    padding: 20
  },
  titleText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "white",
    textAlign: "center"
  },
  counterNumber: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#841584",
    textAlign: "center"
  },
  counterText: {
    fontSize: 30,
    color: "white"
  },
  description: {
    fontSize: 18,
    color: "white",
    textAlign:"center"
  },
  author: {
    fontSize: 15,
    color: "white",
    textAlign:"center",
  },
  buttonRecord: {
    width: "80%"
  }
  
});
