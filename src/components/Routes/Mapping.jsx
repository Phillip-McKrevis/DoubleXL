import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useLoaderData } from "react-router-dom";

import { getMapping, getMappingRoute } from "../../lib/mapping";
import { Checkbox } from "@mui/material";

export async function loader({ params: { mappingId } }) {
  const [mapping, mappingRoute] = await Promise.all([
    getMapping(mappingId),
    getMappingRoute(mappingId),
  ]);

  return { mapping, mappingRoute };
}

function buildRows({ depth = 1, menu, parents = [] }) {
  const rows = [];

  let maxDepth = depth;

  for (const service of menu) {
    const { children } = service;

    if (children) {
      const childRows = buildRows({
        depth: depth + 1,
        menu: children,
        parents: [...parents, service],
      });

      rows.push(...childRows.rows);
      maxDepth = childRows.maxDepth;
    } else {
      rows.push({ ...service, parents });
    }
  }

  return { maxDepth, rows };
}

const Mapping = () => {
  const {
    mapping: { menu, products, category },
  } = useLoaderData();

  console.debug("Got Menu", menu);
  console.debug("Got Products", products);

  const { maxDepth, rows } = buildRows({ menu });

  console.debug("Max row depth", maxDepth);

  return (
    <Paper>
      <TableContainer
        sx={{
          maxHeight: "100vh",
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={maxDepth} />
              {products.map(({ id, name }) => (
                <TableCell
                  align="center"
                  key={id}
                  sx={{
                    padding: "8px",
                    minWidth: "200px",
                  }}
                >
                  {name}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell colSpan={maxDepth} />
              {category.map(({ name }) => (
                <TableCell align="center" key={name}>
                  {name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(({ name, parents, id: rowId }, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={rowId}>
                {parents.map(({ id, name, children: { length: rowSpan } }) => (
                  <TableCell align="left" key={id}>
                    {name}
                  </TableCell>
                ))}
                <TableCell align="left" colSpan={maxDepth - parents.length}>
                  {name}
                </TableCell>
                {products.map(({ id: productId }) => (
                  <TableCell key={`${rowId}#${productId}`} align="center">
                    <Checkbox
                      defaultChecked
                      sx={{
                        color: "#5a8dee",
                        "&.Mui-checked": {
                          color: "#5a8dee",
                        },
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Mapping;
