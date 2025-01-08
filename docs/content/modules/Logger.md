# `Logger`

## Methods

### `setLogLevel(LogLevel)`

Sets the amount of logging.

#### Arguments

| Name       |   Type   | Required | Description                                                                                |
| ---------- | :------: | :------: | ------------------------------------------------------------------------------------------ |
| `LogLevel` | `string` |  `Yes`   | required level of logging, can be `"error" \| "warning" \| "info" \| "debug" \| "verbose"` |

### `setLogCallback(LogCallback)`

Overwrite logging, possibility to mute specific errors/warnings.

#### Arguments

| Name          |    Type    | Required | Description                                                                                                                                                     |
| ------------- | :--------: | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LogCallback` | `function` |  `Yes`   | callback taking a log object `{ message: String, level: LogLevel, tag: String }` as param. If callback return falsy value then default logging will take place. |
