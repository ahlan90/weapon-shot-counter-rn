import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as speech from '@tensorflow-models/speech-commands';
import { Button, ThemeProvider } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import * as Linking from 'expo-linking';


export default class App extends React.Component {

  url = "https://contador-tiros.s3-sa-east-1.amazonaws.com";

  recognizer: speech.SpeechCommandRecognizer | any = null;

  state = {
    microphoneStatus: 0,
    shots: 0,
    score: {
      shot: 0,
      backgroundNoise: 0
    }
  }


  createModel = async () => {

    const checkpointURL = this.url + "/model.json";
    const metadataURL = this.url + "/metadata.json";

    const recognizer = speech.create(
      "BROWSER_FFT",
      undefined,
      checkpointURL,
      metadataURL);

    await recognizer.ensureModelLoaded().catch(err => console.log(err));

    return recognizer;
  }

  onPressRecord = async () => {

    this.setState({ microphoneStatus: 1 });
    
    try {
      this.recognizer = await this.createModel();
      const classLabels = this.recognizer.wordLabels();

      this.recognizer.listen(async (result: any) => {
        const scores = Array.from(result.scores);
        console.log('Result', result);
        
        this.setState({
          score: {
            shot: scores[0],
            backgroundNoise: scores[1]
          },
          shots: this.state.shots + 1
        })
        
      },
      { probabilityThreshold: 0.90 })
      .then(() => {
        this.setState({
          microphoneStatus: 2
        });
      })
      .catch((err: any) => console.log(err));
    } catch (e) {
      throw e;
      console.log('error', e);
    }
  }


  onPressStopRecord = async () => {

    this.setState({ microphoneStatus: 0 });
  
    await this.recognizer.stopListening();
    
  }

  onPressLink = () => {
    Linking.openURL('https://github.com/ahlan90');
  }

  render() {
    return (
      <ThemeProvider>
        <View style={styles.content}>

          <Text style={styles.titleText}>
            {`Contador de Tiros \n Sonoro`}
        </Text>

          <View style={{ width: "100%" }}>
            <Text style={styles.precisionText}>
              Precisão: {this.state.score.shot.toFixed(2)} %
            </Text>
            <Text style={styles.counterNumber}>
              {this.state.shots}
            </Text>
            <Text style={styles.counterText}>
              Tiros
            </Text>
          </View>

          <View style={styles.buttonRecord}>
            {
              this.state.microphoneStatus == 2 
              ?
              <Button
                icon={<Ionicons name="md-mic-off" size={24} color="white" />}
                onPress={this.onPressStopRecord}
                title="   PARAR CONTAGEM"
                buttonStyle={{ backgroundColor: "red" }}
                accessibilityLabel="Botão para encerrar a captura de áudio de tiros" />
              :
              <Button
                icon={<Ionicons name="md-mic" size={24} color="white" />}
                onPress={this.onPressRecord}
                buttonStyle={{ backgroundColor: "#841584" }}
                title="   INICIAR CONTAGEM"
                loading={this.state.microphoneStatus == 1}
                accessibilityLabel="Botão para captura de áudio de tiros" />
            }
          </View>

          
          <View>

            <Button
              icon={<AntDesign name="github" size={24} color="white" />}
              onPress={this.onPressLink}
              title="   Código Fonte"
              titleStyle={{ color: "white" }}
              type="clear"
              accessibilityLabel="Botão para navegar para o repositório do código" />

            <Text style={styles.author}>
              Por Ahlan Guarnier, 2020
            </Text>

          </View>
        </View>
      </ThemeProvider>
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
    width: "100%",
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
    color: "white",
    textAlign:"center"
  },
  precisionText: {
    fontSize: 15,
    color: "green",
    textAlign: "center"
  },
  description: {
    fontSize: 18,
    color: "white",
    textAlign: "center"
  },
  author: {
    fontSize: 15,
    paddingTop: 10,
    color: "white",
    textAlign: "center",
  },
  buttonRecord: {
    width: "80%"
  }

});
