import React from 'react';

export default function Table(props) {

    const style = () => {
        return {
            
            gridTemplateColumns: props.columns,
            ...props.style,
        }
    }

    return (
        <div className="grid-as-table" style={style()}>
          <div className="grid-as-table__header">Descrição</div>
          <div></div>
          {this.props.database.map((item, i, array) => {
              return (
                <React.Fragment key={i}>
                  <div>
                    {item.description}
                  </div>
                  <div>
                    <button
                      onClick={() => this.props.addItem(item)}>
                      <Icon icon="arrowRight"/>
                    </button>
                  </div>
                </React.Fragment>
              )
          })}
      </div>
      )
}