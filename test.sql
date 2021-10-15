SELECT
  bomassembly.assembly AS parentId,
  TO_NUMBER('2' || bomrevision.id) AS id,
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
  '2' || bomrevision.id AS parentId,
  '3' || bomrevisioncomponentmember.id as id,
  bomrevision.name as parentname,
  BUILTIN.DF(bomrevisioncomponentmember.item) as label,
  BUILTIN.DF(item.description) as description,
  'assembly' as type
  
FROM
  bomrevision
  INNER JOIN bomrevisioncomponentmember ON bomrevisioncomponentmember.bomrevision = bomrevision.id
  INNER JOIN item ON bomrevisioncomponentmember.item = item.id
WHERE
  item.itemtype = 'Assembly'
