import { useCallback, useEffect, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Checkbox } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useParams } from "react-router-dom";
import { last } from "lodash";

import AddItemDialogue from "../Utilities/AddItemDialogue/AddItemDialogue.jsx";
import { DEPLOY_EVENT_TYPE } from "../Sidebar/Sidebar.js";
import { useMapping } from "../../hooks/mapping.js";

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

const MappingLoading = () => {
  <CircularProgress />;
};

const Mapping = () => {
  const formRef = useRef();
  const { mappingId } = useParams();
  const mapping = useMapping(mappingId);

  const onDeploy = useCallback((e) => {
    formRef.current.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
  }, []);

  useEffect(() => {
    document.addEventListener(DEPLOY_EVENT_TYPE, onDeploy);

    return () => {
      document.removeEventListener(DEPLOY_EVENT_TYPE, onDeploy);
    };
  }, [onDeploy]);

  if (!mapping) {
    return MappingLoading();
  }

  const { menu, products, category } = mapping;

  console.debug("Got Menu", menu);
  console.debug("Got Products", products);

  const { maxDepth, rows } = buildRows({ menu });

  console.debug("Max row depth", maxDepth);

  function onSubmit() {
    const data = [];

    for (const value of new FormData(formRef.current).values()) {
      const fields = value.split("#");

      data.push({
        menu_id: fields[0],
        product_id: fields[1],
        group_id: fields[2],
        parent_id: fields[3],
      });
    }

    console.log(data);
  }

  return (
    <Paper
      component="form"
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <TableContainer
        sx={{
          maxHeight: "100vh",
        }}
      >
        <Table size="small" stickyHeader aria-label="sticky table">
          <TableHead sx={{ position: "sticky", top: "0", zIndex: "1" }}>
            <TableRow>
              <TableCell colSpan={maxDepth} />
              {products.map(({ id, name }) => (
                <TableCell align="center" colSpan={category.length} key={id}>
                  {name}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell colSpan={maxDepth} />
              {products.reduce((acc, { id: productId }) => {
                return [
                  ...acc,
                  ...category.map(({ id, name }) => (
                    <TableCell align="center" key={`${productId}#${id}`}>
                      {name}
                    </TableCell>
                  )),
                ];
              }, [])}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(({ name, parents, id: rowId }) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={rowId}>
                {parents.map(({ id, name }) => (
                  <TableCell align="left" key={id}>
                    {name}
                  </TableCell>
                ))}
                <TableCell align="left" colSpan={maxDepth - parents.length}>
                  {name}
                </TableCell>
                {products.reduce((acc, { id: productId }) => {
                  return [
                    ...acc,
                    ...category.map(({ id }) => {
                      const name = `${rowId}#${productId}#${id}`;
                      const value = `${name}#${last(parents)?.id ?? ""}`;

                      return (
                        <TableCell key={name} align="center">
                          <Checkbox
                            defaultChecked
                            name={name}
                            sx={{
                              color: "#5a8dee",
                              "&.Mui-checked": {
                                color: "#5a8dee",
                                margin: "0 48px",
                              },
                            }}
                            value={value}
                          />
                        </TableCell>
                      );
                    }),
                  ];
                }, [])}
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
