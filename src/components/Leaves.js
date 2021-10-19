
export const packagingleaf = ({data, selected, level}) => {
    return <div className={"leafdeets leaflevel"+level} style={{color: 'dodgerblue', textDecoration:"none"}}>
        <span className="leafspan"><i style={{color: 'dodgerblue'}} className="fa fa-circle-o"></i></span>
        <span>&nbsp;</span>
        <span className="itemid leafspan">{data.label}</span>
        <span className="itemname leafspan">{data.description}</span>
        <span className="itemquantity leafspan">{data.quantity}</span>
        <span className="itemunit leafspan">{data.units}</span>
        </div>

}


export const ingleaf = ({data, selected, level, scale}) => {
    return <div className={"leafdeets leaflevel"+level} style={{color: 'dodgerblue', textDecoration:"none"}}>
        <span className="leafspan"><i style={{color: 'dodgerblue'}} className="fa fa-circle-o"></i></span>
        <span>&nbsp;</span>
        <span className="itemid leafspan">{data.label}</span>
        <span className="itemname leafspan">{data.displayname}</span>
        <span className="itemquantity leafspan">{data.qty_adjusted}</span>
        {(scale != Infinity && scale != 1) && <span style={{color: 'dodgerblue'}} className="itemquantity leafspan">{Math.round(data.qty_adjusted * scale * 100)/100}</span>}
        <span className="itemunit leafspan">{data.units}</span>
        </div>

}