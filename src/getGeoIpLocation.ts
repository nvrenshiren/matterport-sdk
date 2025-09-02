export async function getGeoIpLocation(e) {
  // return checkAllowHost(window.location.href)
  //   ? e.get("https://static.matterport.com/geoip/", {
  //       responseType: "json",
  //       priority: HttpPriority.LOW
  //     })
  //   : {
  //       city: "",
  //       country_code: "",
  //       country_name: "",
  //       region: ""
  //     }
  return {
    city: "",
    country_code: "",
    country_name: "",
    region: ""
  }
}
