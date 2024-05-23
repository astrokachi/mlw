import * as shell from "shelljs";

// COPY EJS TEMPLATE TO THE DIST FOLDER
shell.cp("-R", "src/utils/ejs", "dist/utils/");
