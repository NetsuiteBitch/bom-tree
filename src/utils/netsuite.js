
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


export function getnodes(){
    var sql = `SELECT
  bomassembly.assembly AS parentID,
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
  TO_NUMBER('2' | | bomrevision.id) AS parentid,
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
  NULL AS parentid,
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


  return executequery(sql)
}