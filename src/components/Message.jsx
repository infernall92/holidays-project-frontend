/* eslint-disable react/prop-types */

export default function Message({ message, isSender, senderName, timestamp }) {
  return (
    <>
      {/* <div className={`message ${isSender ? "sender" : "receiver"}`}>        
        <p className="message-content">{senderName}: {message} <span className="timestamp">{timestamp}</span></p>
        <div className="timestamp-container">
          
        </div>
      </div> */}

      <tbody>
        <tr>
          <td className="timestamp">{timestamp}</td>
          <td>{senderName}</td>
          <td>{message}</td>          
        </tr>
      </tbody>
    </>
  );
}
