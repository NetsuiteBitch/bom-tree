
export function sendemail(message) {
  if(!message) {
    alert('Please enter a message')
  }
    const queryrestlet = "/app/site/hosting/restlet.nl?script=customscript_bomtreesendemail&deploy=1"

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    return fetch(queryrestlet, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            message: message
        })

    }).then(x => x.json()).catch(err => console.log(err))
}


function executequery(query) {
    const queryrestlet = "/app/site/hosting/restlet.nl?script=1803&deploy=1"

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    return fetch(queryrestlet, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            query: query
        })
    }).then(x => x.json()).catch(err => console.log(err))
}

export function getnodes() {
    var sql = `SELECT
  bomassembly.assembly AS parentId,
  TO_NUMBER('2' | | bomrevision.id) AS id,
  BUILTIN.DF(bomassembly.assembly) AS parentname,
  bomrevision.name AS label,
  NULL AS description,
  'bomrev' AS type
FROM
  bomassembly
  INNER JOIN bom ON bom.id = bomassembly.billofmaterials
  INNER JOIN bomrevision ON bomRevision.billofmaterials = bom.id
UNION ALL
SELECT
  TO_NUMBER('2' | | bomrevision.id) AS parentId,
  bomrevisioncomponentmember.item AS id,
  bomrevision.name AS parentname,
  BUILTIN.DF(bomrevisioncomponentmember.item) AS label,
  BUILTIN.DF(item.description) AS description,
  'assembly' AS type
FROM
  bomrevision
  INNER JOIN bomrevisioncomponentmember ON bomrevisioncomponentmember.bomrevision = bomrevision.id
  INNER JOIN item ON bomrevisioncomponentmember.item = item.id
WHERE
  item.itemtype = 'Assembly'
UNION ALL
SELECT
  NULL AS parentId,
  bomassembly.assembly AS id,
  NULL AS parentname,
  BUILTIN.DF(bomassembly.assembly) AS label,
  item.displayname AS description,
  'parentassembly' AS type
FROM
  bomassembly
  INNER JOIN bom ON bom.id = bomassembly.billofmaterials
  AND bom.custrecordbomtype = 1
  inner join item on item.id = bomassembly.assembly`


    return executequery(sql).then(x => x.map(y => { var o = y; y.parentId = y.parentid; delete o.parentid; return o }))
}


export function getitemdeets() {
    var sql = `SELECT
  BUILTIN.DF(bomassembly.assembly) AS assembly,
  TO_NUMBER('2' || bomrevision.id) AS parentid,
  BUILTIN.DF(bom.name) AS bom,
  BUILTIN.DF(BomrevisionComponentmember.item) AS label,
  TO_NUMBER(TO_CHAR(bomrevisioncomponentmember.id) || '0' || TO_CHAR(bomrevisioncomponentmember.item)) as id, 
  rmitem.displayname,
  BomrevisionComponentmember.quantity AS qty_on_bom,
  BUILTIN.DF(BomrevisionComponentmember.units) AS units_on_bom,
  BomrevisionComponentmember.quantity * buom.conversionrate AS qty_in_base,
  BUILTIN.DF(rmitem.unitstype) AS base_unit,
  BUILTIN.DF(custrecordbomtype),
  custrecordbomtype,
  CASE
    WHEN rmitem.unitstype = 15 THEN 1
    WHEN rmitem.unitstype = 50 THEN 16
    ELSE NULL
  END AS pounds_conversion,
  
  ROUND(CASE
    WHEN rmitem.unitstype = 50 THEN (1/16) * bomrevisioncomponentmember.quantity * buom.conversionrate
    ELSE bomrevisioncomponentmember.quantity
  END, 2) AS qty_adjusted,
  CASE WHEN rmitem.unitstype in (50, 15) THEN 'LB' ELSE BUILTIN.DF(bomrevisioncomponentmember.units) end as Units
  
FROM
  bomassembly
  INNER JOIN bom ON bom.id = bomassembly.billofmaterials
  INNER JOIN bomrevision ON bomrevision.billofmaterials = bom.id
  INNER JOIN bomrevisioncomponentmember ON bomrevisioncomponentmember.bomrevision = bomrevision.id
  INNER JOIN item AS RMITEM ON RMITEM.id = bomRevisionComponentMember.item
  INNER JOIN unitstypeuom AS buom ON buom.internalid = bomRevisionComponentMember.units
  where rmitem.itemtype != 'Assembly'`
    return executequery(sql).then(x => x.map(y => { var o = y; y.parentId = y.parentid; delete o.parentid; return o }))
}


export function getpackagingitemsdeets(itemiid) {
    var sql = ` SELECT
    bomassembly.assembly as parentid,
    bomrevisioncomponentmember.item as id,
  BUILTIN.DF(bomrevisioncomponentmember.item) as label,
  COALESCE(rmitem.displayname,' ') as description,
  bomrevisioncomponentmember.quantity,
  BUILTIN.DF(bomrevisioncomponentmember.units) as units
FROM
  bomassembly
  INNER JOIN bom ON bom.id = bomassembly.billofmaterials
  INNER JOIN bomrevision ON bomrevision.billofmaterials = bom.id
  INNER JOIN bomrevisioncomponentmember ON bomrevisioncomponentmember.bomrevision = bomrevision.id
  INNER JOIN item AS RMITEM ON RMITEM.id = bomRevisionComponentMember.item
  INNER JOIN unitstypeuom AS buom ON buom.internalid = bomRevisionComponentMember.units
WHERE
  sysdate BETWEEN bomrevision.effectivestartdate
  AND bomrevision.effectiveenddate
  AND bomassembly.assembly = ${itemiid}
    `
    return executequery(sql).then(x => x.map(y => { var o = y; y.parentId = y.parentid; delete o.parentid; return o }))
}


export function getformula(itemiid){
    var sql = `SELECT
    null as parentid,
      bomrevisioncomponentmember.item as id,
      'Formula' as label,
    FROM
      bomassembly
      INNER JOIN bom ON bom.id = bomassembly.billofmaterials
      INNER JOIN bomrevision ON bomrevision.billofmaterials = bom.id
      INNER JOIN bomrevisioncomponentmember ON bomrevisioncomponentmember.bomrevision = bomrevision.id
      INNER JOIN item AS RMITEM ON RMITEM.id = bomRevisionComponentMember.item
      INNER JOIN unitstypeuom AS buom ON buom.internalid = bomRevisionComponentMember.units
    WHERE
      sysdate BETWEEN bomrevision.effectivestartdate AND bomrevision.effectiveenddate
      AND rmitem.itemtype = 'Assembly'
      AND bomassembly.assembly = ${itemiid}`

    return executequery(sql).then(x => x.map(y => { var o = y; y.parentId = y.parentid; delete o.parentid; return o }))
}


export function getformulaitems(formulaiid){

    var sql = `SELECT
        bomassembly.assembly AS parentid,
        BUILTIN.DF(bom.name) AS bom,
        BUILTIN.DF(BomrevisionComponentmember.item) AS label,
        TO_NUMBER(TO_CHAR(bomrevisioncomponentmember.id) || '0' || TO_CHAR(bomrevisioncomponentmember.item)) as id, 
        rmitem.displayname,
        BomrevisionComponentmember.quantity AS qty_on_bom,
        BUILTIN.DF(BomrevisionComponentmember.units) AS units_on_bom,
        BomrevisionComponentmember.quantity * buom.conversionrate AS qty_in_base,
        BUILTIN.DF(rmitem.unitstype) AS base_unit,
        BUILTIN.DF(custrecordbomtype),
        custrecordbomtype,
        CASE
            WHEN rmitem.unitstype = 15 THEN 1
            WHEN rmitem.unitstype = 50 THEN 16
            ELSE NULL
        END AS pounds_conversion,
        
        ROUND(CASE
            WHEN rmitem.unitstype = 50 THEN (1/16) * bomrevisioncomponentmember.quantity * buom.conversionrate
            ELSE bomrevisioncomponentmember.quantity * buom.conversionrate
        END, 2) AS qty_adjusted,
        CASE WHEN rmitem.unitstype in (50, 15) THEN 'LB' ELSE BUILTIN.DF(bomrevisioncomponentmember.units) end as Units
        
        FROM
        bomassembly
        INNER JOIN bom ON bom.id = bomassembly.billofmaterials
        INNER JOIN bomrevision ON bomrevision.billofmaterials = bom.id
        INNER JOIN bomrevisioncomponentmember ON bomrevisioncomponentmember.bomrevision = bomrevision.id
        INNER JOIN item AS RMITEM ON RMITEM.id = bomRevisionComponentMember.item
        INNER JOIN unitstypeuom AS buom ON buom.internalid = bomRevisionComponentMember.units
        where bomassembly.assembly = ${formulaiid}
        and sysdate between bomrevision.effectivestartdate and bomrevision.effectiveenddate
        `

    return executequery(sql).then(x => x.map(y => { var o = y; y.parentId = y.parentid; delete o.parentid; return o }))
}

export function getspicebags(formulaiid){
    var sql = `
        SELECT
            1000000000 as parentid,
            bomrevisioncomponentmember.item as id,
            BUILTIN.DF(bomrevisioncomponentmember.item) as label,
            bomrevisioncomponentmember.quantity
            FROM
        bomassembly
        INNER JOIN bom ON bom.id = bomassembly.billofmaterials
        INNER JOIN bomrevision ON bomrevision.billofmaterials = bom.id
        INNER JOIN bomrevisioncomponentmember ON bomrevisioncomponentmember.bomrevision = bomrevision.id
        INNER JOIN item AS RMITEM ON RMITEM.id = bomRevisionComponentMember.item
        INNER JOIN unitstypeuom AS buom ON buom.internalid = bomRevisionComponentMember.units
        where bomassembly.assembly = ${formulaiid}
        and rmitem.itemtype = 'Assembly'
        and sysdate between bomrevision.effectivestartdate and bomrevision.effectiveenddate
    `
    return executequery(sql).then(x => x.map(y => { var o = y; y.parentId = y.parentid; delete o.parentid; return o }))

}

export async function getspicebagitems(spicebagiid){
    var sql = `
    SELECT
        bomassembly.assembly AS parentid,
        BUILTIN.DF(bom.name) AS bom,
        BUILTIN.DF(BomrevisionComponentmember.item) AS label,
        TO_NUMBER(TO_CHAR(bomrevisioncomponentmember.id) || '0' || TO_CHAR(bomrevisioncomponentmember.item)) as id, 
        rmitem.displayname,
        BomrevisionComponentmember.quantity AS qty_on_bom,
        BUILTIN.DF(BomrevisionComponentmember.units) AS units_on_bom,
        BomrevisionComponentmember.quantity * buom.conversionrate AS qty_in_base,
        BUILTIN.DF(rmitem.unitstype) AS base_unit,
        BUILTIN.DF(custrecordbomtype),
        custrecordbomtype,
        CASE
            WHEN rmitem.unitstype = 15 THEN 1
            WHEN rmitem.unitstype = 50 THEN 16
            ELSE NULL
        END AS pounds_conversion,
        
        ROUND(CASE
            WHEN rmitem.unitstype = 50 THEN (1/16) * bomrevisioncomponentmember.quantity * buom.conversionrate
            ELSE bomrevisioncomponentmember.quantity * buom.conversionrate
        END, 2) AS qty_adjusted,
        CASE WHEN rmitem.unitstype in (50, 15) THEN 'LB' ELSE BUILTIN.DF(bomrevisioncomponentmember.units) end as Units
        
        FROM
        bomassembly
        INNER JOIN bom ON bom.id = bomassembly.billofmaterials
        INNER JOIN bomrevision ON bomrevision.billofmaterials = bom.id
        INNER JOIN bomrevisioncomponentmember ON bomrevisioncomponentmember.bomrevision = bomrevision.id
        INNER JOIN item AS RMITEM ON RMITEM.id = bomRevisionComponentMember.item
        INNER JOIN unitstypeuom AS buom ON buom.internalid = bomRevisionComponentMember.units
        where bomassembly.assembly = ${spicebagiid}
        and  sysdate between bomrevision.effectivestartdate and bomrevision.effectiveenddate
    `

    return await executequery(sql).then(x => x.map(y => { var o = y; y.parentId = y.parentid; delete o.parentid; return o }))

}


export function getformulaweight(formulaiid){
    var sql = `
    SELECT sum(quantity) as quantity
from(
SELECT
  ROUND(CASE
    WHEN rmitem.unitstype = 50 THEN (1/16) * bomrevisioncomponentmember.quantity * buom.conversionrate
    ELSE bomrevisioncomponentmember.quantity * buom.conversionrate
  END, 2) AS quantity
  
FROM
  bomassembly
  INNER JOIN bom ON bom.id = bomassembly.billofmaterials
  INNER JOIN bomrevision ON bomrevision.billofmaterials = bom.id
  INNER JOIN bomrevisioncomponentmember ON bomrevisioncomponentmember.bomrevision = bomrevision.id
  INNER JOIN item AS RMITEM ON RMITEM.id = bomRevisionComponentMember.item
  INNER JOIN unitstypeuom AS buom ON buom.internalid = bomRevisionComponentMember.units
  where rmitem.itemtype != 'Assembly'
  and  sysdate between bomrevision.effectivestartdate and bomrevision.effectiveenddate
  and bomassembly.assembly = ${formulaiid}


UNION ALL

SELECT
  ROUND(
    CASE
      WHEN rmitem.unitstype = 50 THEN (1 / 16) * bomrevisioncomponentmember.quantity * buom.conversionrate
      ELSE bomrevisioncomponentmember.quantity * buom.conversionrate
    END,
    2
  ) * bags.quantity  as itemquantity
FROM
  bomassembly
  INNER JOIN bom ON bom.id = bomassembly.billofmaterials
  INNER JOIN bomrevision ON bomrevision.billofmaterials = bom.id
  INNER JOIN bomrevisioncomponentmember ON bomrevisioncomponentmember.bomrevision = bomrevision.id
  INNER JOIN item AS RMITEM ON RMITEM.id = bomRevisionComponentMember.item
  INNER JOIN unitstypeuom AS buom ON buom.internalid = bomRevisionComponentMember.units
  INNER JOIN (
    SELECT
      bomrevisioncomponentmember.item AS itemiid,
      bomrevisioncomponentmember.quantity
    FROM
      bomassembly
      INNER JOIN bom ON bom.id = bomassembly.billofmaterials
      INNER JOIN bomrevision ON bomrevision.billofmaterials = bom.id
      INNER JOIN bomrevisioncomponentmember ON bomrevisioncomponentmember.bomrevision = bomrevision.id
      INNER JOIN item AS RMITEM ON RMITEM.id = bomRevisionComponentMember.item
      INNER JOIN unitstypeuom AS buom ON buom.internalid = bomRevisionComponentMember.units
    WHERE
      rmitem.itemtype = 'Assembly'
      AND sysdate BETWEEN bomrevision.effectivestartdate
      AND bomrevision.effectiveenddate
      AND bomassembly.assembly = ${formulaiid}
  ) as bags on bomassembly.assembly = bags.itemiid
  
WHERE
  rmitem.itemtype != 'Assembly'
  AND sysdate BETWEEN bomrevision.effectivestartdate
  AND bomrevision.effectiveenddate
)
    `

    return executequery(sql).then(x => x[0].quantity)
}


