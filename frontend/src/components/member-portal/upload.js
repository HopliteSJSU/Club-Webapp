import React, {Component} from 'react'
import Dropzone from 'react-dropzone'
import Button from '../button/button'
import axios from "axios"
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const uploadImg = require('./upload.png')
export default class UploadScreen extends Component{
    constructor(props){
        super(props)
        this.state = {
            file:null,
            fileUploaded:false,
            fileName:null,
            uploaded:false
        }
    }
    uploadFile = () => {
        let path;
        if (process.env.NODE_ENV === "production") {
            path = process.env.REACT_APP_BACKEND;
        } else {
            path = "http://localhost:8080";
            console.log('ok')
        }
        let data = new FormData();
        data.append('file', this.state.file, this.state.fileName)
        data.append('token', cookies.get('gToken'))
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        axios.post(path + "/api/update/files", data,config)
      .then(res => {
          console.log(res)
        if (res.data.success) {
            this.setState({uploaded:true})
          alert("Success! You are Logged in, thanks.");
        }
      })
      .catch(err => {
        if (
          err.response &&
          err.response.data.msg !== undefined &&
          err.response.data.msg
        )
          alert(err.response.data.msg);
        else alert("Check your file, and try again");
      });

    }
    render(){
        return(
            <div>
                <p style={{textAlign:"center"}} ><b>Upload/Update Resume</b></p>
               Member: {this.props.name} <br/> 
               Email: {this.props.email} <br/>
               {(!this.state.fileUploaded) ? 
                <Dropzone style={{"width" : "100%", "height" : "20%", "border" : "1px solid black"}} onDrop={(acceptedFiles) => {
                    this.setState({file:acceptedFiles[0]});
                    this.setState({fileName:acceptedFiles[0].name});
                    this.setState({fileUploaded:true})}}>
                {({getRootProps, getInputProps}) => (
                    <section>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p style={{textAlign:"center"}}><img src={uploadImg} alt="upload" /><br/>Drag 'n' drop resume here, or click to select file</p>
                        <p style={{textAlign:"center"}}>(Supported formats: 'jpg','png','pdf','docx','doc')</p>
                    </div>
                    </section>
                )}
                </Dropzone> : <div style={{textAlign:"center"}}><br/>{this.state.fileName}<br/></div>}
                <p style={{textAlign:"center"}}><br/><Button label="Submit" clicked={this.uploadFile}/></p>
            </div>

        )
    }
}