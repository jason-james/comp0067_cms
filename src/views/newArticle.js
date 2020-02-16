import React from "react";
import ReactHtmlParser from 'react-html-parser';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios'

export class NewArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewContent: null,
            display: "none",
            title: ''
        }
    }
    openModalSave = async (e) => {
        e.preventDefault();
        await this.setState({ display: "flex", saveOrSubmit: 'save' });
    };

    openModalSubmit = async (e) => {
        e.preventDefault();
        await this.setState({ display: "flex", saveOrSubmit: 'submit' });
    };

    closeModal = (e) => {
        e.preventDefault();
        this.setState({ display: "none" })
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        let url;
        if (this.state.saveOrSubmit === "save") {
            url = '/api/saveNewArticle'
        } else if (this.state.saveOrSubmit === "submit") {
            url = '/api/createArticle'
        }
        const res = await axios.get('/api/getUserInfo');

        await axios.post(url,null, { params: {
            userInfo: res.data,
            title: this.state.title,
            content: this.state.previewContent
        }});
        this.props.history.push('/articles');
    };

    handleEditorChange = (content, editor) => {
        this.setState({previewContent: content});
    };

    render() {
        return (
            <div className='container'>
                <div className='row my-5'>
                    <div className="modal" id="exampleModalCenter" tabIndex="-1" style={{display: this.state.display}}>
                        <div style={{bottom: 0, top: 0, left: 0, right: 0, backgroundColor: 'rgba(10,10,10,.80)', position: 'absolute'}}></div>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLongTitle">Confirm article details</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="formGroupExampleInput">Article Title</label>
                                            <input type="text" className="form-control" id="formGroupExampleInput"
                                                   placeholder="Example input" onChange={e => this.setState({title: e.target.value})}/>
                                        </div>
                                        {/*<div className="form-group">*/}
                                        {/*    <label htmlFor="formGroupExampleInput2">Category</label>*/}
                                        {/*    <input type="text" className="form-control" id="formGroupExampleInput2"*/}
                                        {/*           placeholder="Another input"/>*/}
                                        {/*</div>*/}
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.closeModal}>Close
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-8' >
                        <Editor
                            initialValue="<p>Happy writing!</p>"
                            init={{
                                height: 750,
                                menubar: true,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code wordcount',
                                ],
                                file_picker_types: 'file image media',
                                toolbar:
                                    'undo redo | formatselect | image bold italic backcolor | \
                                    alignleft aligncenter alignright alignjustify | \
                                    bullist numlist outdent indent |',
                                paste_data_images: true,
                            }}
                            onEditorChange={this.handleEditorChange}
                        />
                    </div>
                    <div className='col-md-4'>
                        <div className="marvel-device iphone-x scale--08" style={{top:'-85px'}}>
                            <div className="notch">
                                <div className="camera"></div>
                                <div className="speaker"></div>
                            </div>
                            <div className="top-bar"></div>
                            <div className="sleep"></div>
                            <div className="bottom-bar"></div>
                            <div className="volume"></div>
                            <div className="overflow">
                                <div className="shadow shadow--tr"></div>
                                <div className="shadow shadow--tl"></div>
                                <div className="shadow shadow--br"></div>
                                <div className="shadow shadow--bl"></div>
                            </div>
                            <div className="inner-shadow"></div>
                            <div className="screen" style={{overflowY: 'auto'}}>
                                <div className='my-5 mx-2'>
                                    { ReactHtmlParser(this.state.previewContent) }
                                </div>
                            </div>
                            <div className='submit-article-buttons my-5 d-flex justify-content-center'>
                                <button type="button" className="btn btn-lg btn-secondary mx-1" onClick={this.openModalSave}>Save</button>
                                <button type="button" className="btn btn-lg btn-primary mx-1" onClick={this.openModalSubmit}>Submit</button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        )
    }
}