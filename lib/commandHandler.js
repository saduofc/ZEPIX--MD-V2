//sadiya tech
const fs = require("fs");
const path = require("path");
if (!fs) return;

const loadCommands = (commandsDir = "../commands") => {
  const commands = new Map();
  const resolvedDir = path.resolve(__dirname, commandsDir);

  // Check if the commands directory exists
  if (!fs.existsSync(resolvedDir)) {
    console.error("[ERROR] Commands directory not found:", resolvedDir);
    return commands;
  }

  // Read all files in the commands directory
  try {
    const commandFiles = fs.readdirSync(resolvedDir).filter((file) => {
      return path.extname(file).toLowerCase() === ".js"; // Only .js files
    });

    // Load each command file
    for (const file of commandFiles) {
      try {
        const commandPath = path.join(resolvedDir, file);
        const commandsFromFile = require(commandPath); // This could be an array

        if (Array.isArray(commandsFromFile)) {
          // Add each command to the Map
          commandsFromFile.forEach((command) => {
            if (command.name && typeof command.execute === "function") {
              commands.set(command.name, command);
            } else {
              console.warn(
                `[WARN] Command in "${file}" is missing a "name" or "execute" property. Skipping.`
              );
            }
          });
        } else if (
          commandsFromFile.name &&
          typeof commandsFromFile.execute === "function"
        ) {
          // Handle single command files if needed
          commands.set(commandsFromFile.name, commandsFromFile);
        } else {
          console.warn(
            `[WARN] Command file "${file}" is missing a valid command structure. Skipping.`
          );
        }
      } catch (err) {
        console.error(`[ERROR] Failed to load command "${file}":`, err.message);
      }
    }
  } catch (err) {
    console.error("[ERROR] Failed to read commands directory:", err.message);
  }

  return commands;
};

function handleCommand(sock, msg, m, context) {
  const {
    sadiya_api_key,
    sadiya_md_footer,
    sadiya_md_img,
    replyimg,
    from,
    prefix,
    quoted,
    body,
    command,
    args,
    q,
    isGroup,
    sender,
    senderNumber,
    botNumber,
    pushname,
    isMe,
    isOwner,
    reply,
  } = context;

  // Load the commands dynamically
  const commands = loadCommands("../commands");

  // Find the command
  const cmd = commands.get(command);

  if (!cmd) {
    reply(`❌ Command "${command}" not found.`);
    return;
  }

  // Check for owner-only commands
  if (cmd.ownerOnly && !isOwner) {
    reply("❌ This command can only be used by the owner.");
    return;
  }

  if (cmd.react) {
    sock.sendMessage(from, {
      react: {
        text: cmd.react,
        key: msg.key,
      },
    });
  }

  // Execute the command
  try {
    cmd.execute(sock, msg, args, {
      sadiya_api_key,
      sadiya_md_footer,
      sadiya_md_img,
      replyimg,
      from,
      prefix,
      quoted,
      body,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber,
      pushname,
      isMe,
      isOwner,
      reply,
    });
  } catch (err) {
    console.error(
      `[ERROR] Failed to execute command "${command}":`,
      err.message
    );
    reply("❌ An error occurred while executing the command.");
  }
}

module.exports = { loadCommands, handleCommand };
