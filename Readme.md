
# ipm package: edge_update_mipsle

## Overview

User interface and assets that can be used to easily upgrade the ClearBlade Edge binary on IoT gateways executing ClearBlade Edge on a 64bit AMD linux architecure.

This is an ipm package, which contains one or more reusable assets within the ipm Community. The 'package.json' in this repo is a ipm spec's package.json, [here](https://docs.clearblade.com/v/3/6-ipm/spec), which is a superset of npm's package.json spec, [here](https://docs.npmjs.com/files/package.json).

[Browse ipm Packages](https://ipm.clearblade.com)

## Setup

1. Change the value of the UPDATE_PLATFORM_URI constant in the edge_update_constants library to match the URI of the ClearBlade Platform instance where your system is located.
2. Create a system on the ClearBlade platform and install this IPM.
3. Go to the Users tab and create a User and assign the role of _edge\_updater_ to the user. Make sure you can remember your password.
  * Alternatively, you can utilize the predefined _updater@clearblade.com_ user. The password for the _updater@clearblade.com_ user is _clearblade_.
4. Go to the Edges tab and create a new edge
5. Clone the https://github.com/ClearBlade/edge-service-management github repo and copy (scp) the _systemd/install\_edge.sh_ file from the repo to the home directory of your gateway.
  * `scp systemd/install_edge.sh <your user id>@<your gateway IP address>:~/install_edge.sh`
6. SSH into your gateway and edit the _install\_edge.sh_ file using a text editor you are familiar with. Change the following values at the top of the file:
  * RELEASE="4.3.0" # Change the version to a version appropriate for your platform instance
  * EDGE_COOKIE="<EDGE_COOKIE>" #Cookie from Edge Config Screen
  * EDGE_ID="<EDGE_ID>" #Edge Name when Created in the system
  * PARENT_SYSTEM="<PARENT_SYSTEM_KEY>" #System Key of the system to connect to
  * PLATFORM_HOST_NAME="<PLATFORM_URL>" #FQDN Hostname to connect to
  * WORK_DIR="/home/pi" # home directory for the logged on user on your gateway
7. Make the _install\_edge.sh_ script executable (`chmod +x install_edge.sh`) and execute the _install\_edge.sh_ script under sudo (`sudo ./install_edge.sh`)
8. Go to the Adapters tab, select the updateEdgeAdapter adapter, click the pencil edit icon next to Configuration, and download the updateEdgeAdapter_service file. Open it up and change the values of the _-systemKey=_, _-systemSecret=_, _-platformURL=_, _-messagingURL=_ and _-edgeInstallDir=_ parameters on the __ExecStart=__ line. You can find the System Key and System Secret on the platform if you select the info tab, and then the System Settings subtab. Add _-serviceName=clearblade_ to the __ExecStart=__ parameter list. After you've changed the values, save the file, go back to the edit configuration modal in the Adapters tab, and replace the updateEdgeAdapter_service file.
  * __systemKey__ - You can find the System Key on the platform if you select the info tab, and then the System Settings subtab
  * __systemSecret__ - You can find the System Secret on the platform if you select the info tab, and then the System Settings subtab
  * __platformURL__ - Copy the URI (including the port if it is displayed) from the browser displaying the ClearBlade Platform console (for example, http://platform.clearblade.com)
  * __messagingURL__ - This will typically be the DNS name of the ClearBlade platform and the appropriate messaging port (for example, platform.clearblade.com:1883)
  * __edgeInstallDir__ - Specify the directory ClearBlade Edge was installed into in step 5 above.
  * __serviceName__ - The name of the init.d or system.d service edge was installed as. Step 7 above installed ClearBlade Edge into system.d with a service name of _clearblade_
9. Wait a few minutes and verify _updateEdgeAdapter_ is running on your gateway (`ps -ef`)

## Usage
1. Go to the Portals tab and click on the __Edge_Updater__ portal. 
2. Log into the portal using the user ID and password created in step 3 above (or use the pre-defined updater@clearblade.com user).
3. The ClearBlade Edges provisioned to your system will be displayed in the upper left-hand corner. Edges with a green indicator are already running the same version as the version of the ClearBlade Platform instance. Edges with a red indicator are edges that are candidates for upgrading.
4. Select (click) an Edge with a red indicator. Details of the edge will be displayed along with an _Upgrade Edge_ button.
5. Click the _Upgrade Edge_ button. Log messages from the updateEdgeAdapter adapter will be displayed in the _Edge Update Status_ section in the upper right-hand corner. You will see a log message stating _Edge updated successfully to version X.X.X_ when the edge binary is successfully upgraded. If any errors occur preventing the upgrade of the edge binary, apprpriate error messages will be displayed.

_Note:_ The saveEdgeVersion code service can be executed to manually set the edge version if needed. This is what should be done to test the edge upgrade process on a previously upgraded edge. The payload sent to the code service should be structured as follows:
  `{
  "edgeId": <YOUR_EDGE_ID>,
  "version": "0.0.1"
}`

