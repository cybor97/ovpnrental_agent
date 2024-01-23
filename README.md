# OpenVPN rental agent app

In order to run you need to follow these steps:

- Fill in your SQS credentials in .env file as per [example](.env.example)
- `yarn install`
- `yarn dev`

To get the executables:

- `yarn build` - will compile JS in "tsbuild" directory
- `yarn pkg` - will build a single executable in "dist" directory

In order to install to the target environment you can proceed with systemctl service file like this:

```ini
[Unit]
Description=OVPNRental agent service
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=ubuntu
WorkingDirectory=/home/ubuntu #Here you can set the directory where .env file is stored
ExecStart=/usr/bin/ovpnrental_agent #Target executable

[Install]
WantedBy=multi-user.target
```
