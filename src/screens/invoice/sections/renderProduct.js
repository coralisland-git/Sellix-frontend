import {Button} from "../../../components";
import React from "react";
import Link from "react-router-dom/es/Link";
import {CopyToClipboard} from "react-copy-to-clipboard";



const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


const RenderProduct = ({ product_type, tostifyAlert, info, onSaveFile }) => {

  const copyToClipboard = () => {
    tostifyAlert('success', "Copied to Clipboard.")
  }

  if(product_type === "file" && info.file_attachment) {
    return <div>
        <pre className={"mb-4 m-0"}>
          <span>File Name: {info.file_attachment.original_name}</span><br/>
          <span>Size: {formatBytes(info.file_attachment.size)}</span>
        </pre>
      <Button color={"default"} style={{ width: "150px"}} onClick={onSaveFile}><i className={"fas fa-save"}/>&nbsp;&nbsp;Download File</Button>
    </div>
  }

  if(product_type === "serials" && info.serials.length) {
    return <div>
        <pre className={"mb-4 m-0"}>
          {info.serials.map((v, key) => <span key={key} style={{ fontSize: "12px", lineHeight: 1}}>{v}<br/></span>)}
        </pre>

      <div className={"d-flex"}>
        <CopyToClipboard text={info.serials} onCopy={() => copyToClipboard()}>
          <Button color={"primary"} style={{ width: "200px"}} className={"mr-4"}><i className={"fas fa-copy"}/> Copy to clipboard</Button>
        </CopyToClipboard>
        <Button color={"default"} style={{ width: "150px"}} onClick={onSaveFile}><i className={"fas fa-save"}/>&nbsp;&nbsp;Save as File</Button>
      </div>
    </div>
  }

  if(product_type === "service") {
    if(info.service_text) {
      return <div>
          <pre className={"mb-4 m-0"}>
            <span dangerouslySetInnerHTML={{ __html: info.service_text }} />
          </pre>

        <div className={"d-flex"}>
          <CopyToClipboard text={info.service_text} onCopy={() => copyToClipboard()}>
            <Button color={"primary"} style={{ width: "200px"}} className={"mr-4"} ><i className={"fas fa-copy"}/> Copy to clipboard</Button>
          </CopyToClipboard>
          <Button color={"default"} style={{ width: "150px"}} onClick={onSaveFile}><i className={"fas fa-save"}/>&nbsp;&nbsp;Save as File</Button>
        </div>
      </div>
    } else {
      return <div>
        <span><p>This product has no service text, please wait further actions by the seller or open a query on his page.</p></span><br/>
        <Link to={`${info.product.username}/contact`} target={"_blank"}><Button color={"default"}>
          <i className={"fas fa-comments"}/>&nbsp;&nbsp;Contact {info.product.username}
        </Button></Link>
      </div>
    }
  }

  return null
}

export default RenderProduct