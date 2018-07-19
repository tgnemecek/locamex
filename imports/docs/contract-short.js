import React from 'react';
import { Style } from 'react-style-tag';

export default class ContractShort extends React.Component {
  render() {
    return (
      <div>
        {/* change div above to html tag! */}
        {/* <head style={{background: 'red'}}> */}
          {/* <meta charSet="utf8"/> */}
          {/* <title>Contract</title> */}
          {/* <Style>{`
            .doc_body {
              font-family: Helvetica, Arial, sans-serif;
              margin: 40px;
            }
            .doc__header {
              margin-bottom: 50px;
            }
            .doc_left-box {
              float: left;
            }
            .doc__right-box {
              float: right;
            }
            .doc_title {
              text-align: center;
            }
            .doc_paragraph {
              text-align: justify;
            }
          `}</Style> */}
        {/* </head> */}
        {/* change div below to body tag! */}
        <div className="doc__body">
          <div className="doc__header">
            <div className="doc__left-box">
                Caixa de texto esquerda.
            </div>
            <div className="doc__right-box">
              Caixa de texto direita.
            </div>
          </div>
          <h1 className="doc__title">Contrato de Prestação de serviços XXX</h1>
          <div className="doc__paragraph">
            <p>
              Donec blandit nunc eu hendrerit blandit.
              Donec semper faucibus congue.
              Curabitur vitae arcu et magna elementum bibendum in quis mauris.
              Sed gravida erat eu risus vulputate tincidunt.
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
              Cras pretium imperdiet porttitor. Praesent pulvinar pharetra nisl, elementum scelerisque lectus molestie ac.
            </p>
          </div>
          <div className="doc__paragraph">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nullam maximus feugiat rutrum. Aliquam feugiat turpis eget erat bibendum, nec molestie magna tempus.
              Phasellus imperdiet velit nec augue ultricies, nec bibendum massa congue.
              In varius, libero id eleifend ultrices, nulla nulla suscipit tortor, vel elementum felis nisl sed magna.
              Integer scelerisque vitae odio non tempus. Pellentesque consectetur massa bibendum vehicula molestie.
              Etiam pellentesque convallis odio venenatis bibendum. Vivamus lorem dui, aliquet a ipsum vitae, vestibulum pharetra justo.
              Maecenas in sagittis sapien.
            </p>
          </div>
          <div>
            <table className="doc__table">
              <tbody>
                <tr>
                  <th>A</th>
                  <th>B</th>
                  <th>C</th>
                  <th>D</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Lorem ipsum dolor sit amet</td>
                  <td>lis odio venenatis bibendum</td>
                  <td>AAAA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}