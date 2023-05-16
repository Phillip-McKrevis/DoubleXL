import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useParams } from "react-router-dom";
import { useMapping } from "../../hooks/mapping.js";
import AddItemDialogue from "../Utilities/AddItemDialogue/AddItemDialogue.jsx";

import { Checkbox } from "@mui/material";

function buildRows({ depth = 1, menu, parents = [] }) {
  const rows = [];

  let maxDepth = depth;

  for (const service of menu) {
    const { children } = service;

    if (children) {
      const childRows = buildRows({
        depth: depth + 2,
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
  const { mappingId } = useParams();
  const { menu, products, category } = useMapping(mappingId);

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
        <Table size="small" stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={maxDepth} />
              {products.map(({ id, name }) => (
                <TableCell
                  align="center"
                  key={id}
                  sx={{
                    padding: "8px",
                    minWidth: "150px",
                    minHeight: "200px",
                  }}
                >
                  {name}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell colSpan={maxDepth} />
              {products.map(({ id }) => (
                <TableCell align="center" key={id}>
                  {category.map(({ name }) => (
                    <TableCell
                      align="center"
                      key={name}
                      sx={{
                        borderBottom: "0px",
                        minWidth: "150px",
                        minHeight: "200px",
                      }}
                    >
                      {name}
                    </TableCell>
                  ))}
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
                    {category.map(({ name }) => (
                      <Checkbox
                        defaultChecked
                        key={name}
                        sx={{
                          color: "#5a8dee",
                          "&.Mui-checked": {
                            color: "#5a8dee",
                            margin: "0 48px",
                          },
                        }}
                      />
                    ))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AddItemDialogue />
      </TableContainer>
    </Paper>
  );
};

export default Mapping;
