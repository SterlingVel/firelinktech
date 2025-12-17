import React, { useState, useRef, useContext } from 'react'
import { firebase } from "../tools/config.js";
import { database } from "../tools/database.js";
import { LayoutContext } from '../components/Layout'

const PRODUCT_PLACEHOLDERS = [
  {
    name: "System Sensor Horns / Strobes",
    desc: "Deliver clear audible and visual alerts for fire emergencies",
    img: "Gen Horn strobes-Red & Wht.jpg"
  },
  {
    name: "Relay Detectors",
    desc: "Detect smoke and trigger system relays - various parts available",
    img: "products/p8.png"
  },
  {
    name: "Fire Alarm Bells",
    desc: "Traditional, unmistakable bell sounds for fire alarm notifications",
    img: "Fire Alarm Bell.jpg"
  }
];

export default class ServicePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      email: null,
      uid: null,
      name: null,
      files: [],
      userFiles: [],
      admin: "none",
      showUploadPopup: false,
      selectedFile: null,
      uploadName: '',
      uploadDescription: '',
      uploadError: '',
      uploadLoading: false,
      signInAttempts: 0,
      signInBlocked: false,
      confirmErase: false,
      fileToErase: null,
    };
    this.fileInputRef = React.createRef();
  }

  static contextType = LayoutContext;

  async componentDidMount() {
    const { fileKey, signInId, sideViewId } = this.props;

    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const adminRef = firebase.database().ref('admins/' + user.uid);
        const snapshot = await adminRef.once('value');

        if (snapshot.exists()) {
          this.setState({
            email: user.email,
            uid: user.uid,
            name: user.displayName || snapshot.val().name,
            admin: "block"
          });

          const sideViewEl = document.getElementById(sideViewId);
          if (sideViewEl) sideViewEl.style.display = "inline-block";
        } else {
          await firebase.database().ref('unauthorized_attempts/' + user.uid).set({
            email: user.email,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            page: window.location.pathname
          });

          await firebase.auth().signOut();
          alert('You do not have administrator privileges.');
          return;
        }
      } else {
        const sideViewEl = document.getElementById(sideViewId);
        if (sideViewEl) sideViewEl.style.display = "none";
      }
    });

    this.setState({ files: await database.getAllFiles(fileKey) });
  }

  setTitle(event) {
    this.setState({ title: event.target.value });
  }

  async signOut() {
    await firebase.auth().signOut();
    this.setState({
      user: null,
      uid: null,
      email: null,
      name: null,
      admin: "none",
      userFiles: []
    });
    document.getElementById(this.props.sideViewId).style.display = "none";
  }

  async showFiles() {
    document.getElementById("fileUploader").addEventListener('change', async (event) => {
      await database.add(this.props.fileKey, event.target.files, this.state.email, this.state.uid, this.state.name);
      this.setState({ files: await database.getAllFiles(this.props.fileKey) });
    });
  }

  async openLink(file) {
    await firebase.storage().ref(`${this.props.fileKey}/${file.ref}`).getDownloadURL().then((res) => {
      window.open(res, '_blank');
    });
  }

  handleEraseClick = (file, e) => {
    e.stopPropagation();
    this.setState({ confirmErase: true, fileToErase: file });
  };

  handleEraseConfirm = async () => {
    await this.eraseFile(this.state.fileToErase);
    this.setState({ confirmErase: false, fileToErase: null });
  };

  handleEraseCancel = () => {
    this.setState({ confirmErase: false, fileToErase: null });
  };

  async eraseFile(file) {
    await database.erase(this.props.fileKey, file, this.state.uid);
    this.setState({ files: await database.getAllFiles(this.props.fileKey) });
  }

  handleFileClick = () => {
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = '';
      this.fileInputRef.current.click();
    }
  }

  handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      this.setState({
        selectedFile: file,
        showUploadPopup: true,
        uploadName: '',
        uploadDescription: '',
        uploadError: '',
      });
    }
  }

  handlePopupInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'uploadName' && value.length > 100) return;
    if (name === 'uploadDescription' && value.length > 500) return;
    this.setState({ [name]: value });
  }

  handlePopupFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      this.setState({ selectedFile: file });
    }
  }

  handlePopupCancel = () => {
    this.setState({
      showUploadPopup: false,
      selectedFile: null,
      uploadName: '',
      uploadDescription: '',
      uploadError: '',
      uploadLoading: false,
    });
  }

  handlePopupSubmit = async (e) => {
    e.preventDefault();
    const { selectedFile, uploadName, uploadDescription, email, uid, name } = this.state;
    const { fileKey } = this.props;
    if (!selectedFile || !uploadName.trim() || !uploadDescription.trim()) {
      this.setState({ uploadError: 'All fields are required.' });
      return;
    }
    this.setState({ uploadError: '', uploadLoading: true });
    try {
      await database.add(
        fileKey,
        [selectedFile],
        email,
        uid,
        name,
        uploadName.trim(),
        uploadDescription.trim()
      );
      this.setState({
        files: await database.getAllFiles(fileKey),
        showUploadPopup: false,
        selectedFile: null,
        uploadName: '',
        uploadDescription: '',
        uploadError: '',
        uploadLoading: false,
      });
    } catch (err) {
      this.setState({ uploadError: 'Upload failed. Please try again.', uploadLoading: false });
    }
  }

  render() {
    const {
      introHeader, introSub, introBody, fileHeader, sideViewId,
    } = this.props;
    const {
      showUploadPopup, selectedFile, uploadName, uploadDescription, uploadError, uploadLoading
    } = this.state;

    return (
      <div className="servicePage-outer">
        <div className="servicePage-inner">
          <div className="service-main-col">
            <div className="serviceIntroContainer">
              <p className="serviceIntroHeader">{introHeader}</p>
              <p className="serviceIntroBody">{introBody}</p>
            </div>

            <div style={{ display: "none" }} id={sideViewId} className="serviceSideContainer">
              <div className="service-side-actions">
                <button
                  type="button"
                  className="service-upload-btn"
                  onClick={this.handleFileClick}
                >
                  Upload File
                </button>
                <p
                  onClick={e => this.signOut()}
                  className="signOut"
                  id="signout"
                  style={{ margin: 0 }}
                >
                  Sign Out
                </p>
              </div>
              <input
                ref={this.fileInputRef}
                type="file"
                id="fileUploader"
                className="addFile"
                accept=".pdf"
                multiple={false}
                style={{ display: 'none' }}
                onChange={this.handleFileChange}
              />
            </div>

            <div className="serviceFilesContainer">
              <div className="service-files-header-row">
                <h2 className="service-files-header">Latest in {fileHeader}</h2>
                <div className="service-files-header-divider" />
              </div>
              <div className="service-files-list">
                {this.state.files.length === 0 && (
                  <div className="service-files-empty">No news or updates have been posted for this service yet. Please check back soon!</div>
                )}
                {this.state.files.map((each, idx) => (
                  <div className="service-file-card" key={each.ref} onClick={() => this.openLink(each)}>
                    <div className="service-file-card-header-row">
                      <div className="service-file-title">{each.name}</div>
                      <div className="service-file-date">{each.date}</div>
                    </div>
                    <div className="service-file-description">{each.description}</div>
                    <div className="service-file-actions">
                      <button className="eraseFile"
                        style={{ display: this.state.admin }}
                        onClick={(e) => {
                          this.handleEraseClick(each, e);
                          e.stopPropagation();
                        }}
                        alt="erase"
                      >
                        Erase File
                      </button>
                    </div>
                    {idx !== this.state.files.length - 1 && (
                      <div className="service-file-divider" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="servicePage-divider" />

          <aside className="service-products-col">
            <h3 className="service-products-header">Featured Products</h3>
            <div className="service-products-disclaimer">
              These products are currently not available for purchase directly on our site, but you can contact us anytime for more details or inquiries.
            </div>
            <button
              className="service-product-inquiry-btn"
              onClick={() => this.context.scrollToContact()}
            >
              <span className="contact-icon service-product-btn-icon" aria-hidden="true">
                <img src="/icons/mail.svg" alt="" width={20} height={20} />
              </span>
              <span className="service-product-btn-text">Make An Inquiry</span>
            </button>
            <div className="service-products-list">
              {PRODUCT_PLACEHOLDERS.map((prod, idx) => (
                <div className="service-product-card" key={idx}>
                  <div className="service-product-img-wrap">
                    <img src={prod.img} alt={prod.name} className="service-product-img" />
                  </div>
                  <div className="service-product-info">
                    <div className="service-product-title">{prod.name}</div>
                    <div className="service-product-desc">{prod.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {showUploadPopup && (
          <div className="upload-popup-overlay">
            <div className="upload-popup">
              <form onSubmit={this.handlePopupSubmit}>
                <h3>Upload File</h3>
                <label>
                  <input
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={this.handlePopupFileChange}
                    id="popupFileInput"
                  />
                  <div className="fileInputContainer">
                    <button
                      type="button"
                      className="service-choose-file-btn"
                      id="serviceChooseFileBtn"
                      onClick={() => document.getElementById('popupFileInput').click()}
                    >
                      Change File
                    </button>
                    <br />
                    <span className="serviceChooseFileText" onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}>
                      {selectedFile ? selectedFile.name : 'No file chosen'}
                    </span>
                  </div>
                </label>
                <label>
                  Title
                  <input
                    type="text"
                    name="uploadName"
                    value={uploadName}
                    maxLength={100}
                    onChange={this.handlePopupInputChange}
                    required
                  />
                </label>
                <label>
                  Description
                  <textarea
                    name="uploadDescription"
                    value={uploadDescription}
                    maxLength={500}
                    onChange={this.handlePopupInputChange}
                    required
                  />
                </label>
                {uploadError && (
                  <div style={{ color: '#dc2836', margin: '8px 0', fontSize: '15px' }}>
                    {uploadError}
                  </div>
                )}
                <div className="upload-popup-actions">
                  <button type="button" className="btn outline popup" onClick={this.handlePopupCancel} disabled={uploadLoading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn primary popup" disabled={uploadLoading}>
                    {uploadLoading ? <span className="loader"></span> : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
            <div className="upload-popup-bg"></div>
          </div>
        )}

        {this.state.confirmErase && (
          <div className="erase-confirm-overlay">
            <div className="erase-confirm-popup">
              <h3>Confirm File Deletion</h3>
              <p>Are you sure you want to erase <b>{this.state.fileToErase?.name}</b>? This action cannot be undone.</p>
              <div className="erase-confirm-actions">
                <button className="btn outline" onClick={this.handleEraseCancel}>Cancel</button>
                <button className="btn danger" onClick={this.handleEraseConfirm}>Erase</button>
              </div>
            </div>
            <div className="erase-confirm-bg"></div>
          </div>
        )}
      </div>
    );
  }
}