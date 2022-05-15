$(document).ready(function () {
  // api methone connexion
  var server = "https://tontine-smart.herokuapp.com"
  var endPoints = {
    addTontine: { url: "/addTontine", description: "Create a Tontine" },
    addParticipants: {
      url: "/addParticipants",
      description: "Add a participant to a Tontine"
    },
    addCotisations: {
      url: "/addCotisations",
      description: "Add a contribution to a Tontine"
    },
    DemandeRetrait: {
      url: "/DemandeRetrait",
      description: "demand a withdraw from a Tontine"
    },
    transfer: {
      url: "/transfer",
      description: "Tranfer Tez to a participant after withdraw demand"
    }
  }
  function addTontine(
    tontine = {
      balance: 0,
      descriptif: "Finance Training Tontine",
      goal: 24,
      montantACotiser: 8,
      nom: "Tech friends Tontine",
      nombreParticipants: 3
    }
  ) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: server + endPoints.addTontine.url,
        data: tontine,
        success: function (result) {
          return resolve(result)
        },
        error: function (error) {
          reject(error)
        }
      })
    })
  }
  function addParticipant(
    participant = {
      rang: "R1",
      publicKey: "tz1M6x9Y4cAGWpmkJjrSopTLfTLAUVmCZhh4"
    }
  ) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: server + endPoints.addParticipants.url,
        data: participant,
        success: function (result) {
          return resolve(result)
        },
        error: function (error) {
          reject(error)
        }
      })
    })
  }
  function addCotisations(
    cotisation = {
      amount: 8,
      publicKey: "tz1M6x9Y4cAGWpmkJjrSopTLfTLAUVmCZhh4",
      round: 1
    }
  ) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: server + endPoints.addCotisations.url,
        data: cotisation,
        success: function (result) {
          return resolve(result)
        },
        error: function (error) {
          reject(error)
        }
      })
    })
  }
  function demandeRetrait(
    Order = {
      publicKey: "tz1M6x9Y4cAGWpmkJjrSopTLfTLAUVmCZhh4",
      id: 1
    }
  ) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: server + endPoints.DemandeRetrait.url,
        data: Order,
        success: function (result) {
          return resolve(result)
        },
        error: function (error) {
          reject(error)
        }
      })
    })
  }
  // end api methondes connection

  $(".invoice-repeater, .repeater-default").repeater({
    show: function () {
      $(this).slideDown()
      // Feather Icons
      if (feather) {
        feather.replace({ width: 14, height: 14 })
      }
    },
    hide: function (deleteElement) {
      if (confirm("Voulez vous vraiment retirer ce participant?")) {
        $(this).slideUp(deleteElement)
      }
    }
  })
  var listTontineLocal = []
  var myData = {}
  var Selectedtontine = {}

  function initVew() {
    listTontineLocal = JSON.parse(localStorage.getItem("listTontineLocal"))
    myData = JSON.parse(localStorage.getItem("myData"))
    $("#tontinNumber").html(listTontineLocal.length + " tontine(s)")
    $("#userLocal").html(myData.name)
    $("#myDataName").val(myData.name)
    $("#myDataPublicKey").val(myData.publicKey)
  }

  initVew()
  function appendUserAvatar(usersKey = []) {
    var res = ""
    for (let i = 0; i < usersKey.length; i++) {
      const user = usersKey[i]
      res += `<li data-bs-toggle="tooltip" data-popup="tooltip-custom"
          data-bs-placement="top" title="${user.publicKey}"
          class="avatar avatar-sm pull-up">
          <img class="rounded-circle" src="https://www.gravatar.com/avatar/${user.publicKey}"
              alt="Avatar" />
      </li>`
    }
    return res
  }

  for (let i = 0; i < listTontineLocal.length; i++) {
    const tontine = listTontineLocal[i]
    $("#listTontineLocal").append(`<div class="card" style="margin:0 auto;">
  <div class="card-body">
      <div class="d-flex justify-content-between">
          <span>Participants: ${tontine.participants.length}</span>
          <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
              ${appendUserAvatar(tontine.participants)}
          </ul>
      </div>
      <div class="d-flex justify-content-between align-items-end mt-1 pt-25">
          <div class="role-heading">
              <h4 class="fw-bolder">${tontine.nom}</h4>
              <p>${tontine.descriptif}</p>
              <a href="javascript:;" class="role-edit-modal tontinezAct" data-id="${i}">
                  <small class="fw-bolder">Tontiner (${
                    tontine.montantACotiser
                  }Xtz)</small>
              </a>
          </div>
          <a href="javascript:void(0);" data-bs-toggle="modal"
          data-bs-target="#showTontine" data-id="${i}" class="text-body showTontine"><i data-feather="eye"
                  class="font-medium-5"></i> Voir</a>
      </div>
  </div>
</div>`)
  }

  function getMyRound(tontineId = "") {
    var listTontineLocal = JSON.parse(localStorage.getItem("listTontineLocal"))
    for (let i = 0; i < listTontineLocal.length; i++) {
      const tontine = listTontineLocal[i]
      if (tontineId == tontine.id) {
        for (let j = 0; j < tontine.participants.length; j++) {
          const participant = tontine.participants[j]
          if (participant.publicKey == myData.publicKey) {
            return participant.rang.slice(1, participant.rang.length)
          }
        }
      }
    }
  }

  $("#editMyData").click(function () {
    myData.name = $("#myDataName").val()
    myData.publicKey = $("#myDataPublicKey").val()
    localStorage.setItem("myData", JSON.stringify(myData))
    initVew()
  })

  $(".showTontine").click(function () {
    Selectedtontine = listTontineLocal[$(this).attr("data-id")]

    $("#selectedTontinName").html(Selectedtontine.nom)
    $("#selectedTontinDecriptif").html(Selectedtontine.descriptif)
    $("#selectedTontineInvit").html(Selectedtontine.participants.length)
    $("#selectedTontineMontantATontiner").html(
      Selectedtontine.montantACotiser + "Xtz"
    )
    $("#selectedTontineGoal").html(Selectedtontine.goal)
  })

  $("#askRetarit").click(function () {
    var tontineId = Selectedtontine.id
    var order = {
      publicKey: myData.publicKey,
      id: tontineId
    }

    demandeRetrait(order)
      .then(function (result) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Votre requette a ben ete pris en compte",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            confirmButton: "btn btn-primary"
          },
          buttonsStyling: false
        })
      })
      .catch((error) => {})
  })

  $(".tontinezAct").click(function () {
    var tontine = listTontineLocal[$(this).attr("data-id")]
    var cotisation = {
      amount: tontine.montantACotiser,
      publicKey: "tz1M6x9Y4cAGWpmkJjrSopTLfTLAUVmCZhh4",
      round: getMyRound(tontine.id),
      id: tontine.id
    }

    addCotisations(cotisation)
      .then(function (result) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Vontre contisation a bien ete effectuée",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            confirmButton: "btn btn-primary"
          },
          buttonsStyling: false
        })
      })
      .catch((error) => {})
  })

  $("#addTontineForm").submit(function (e) {
    e.preventDefault()
    var $inputs = $("#addTontineForm :input")
    var values = {}
    var participants = []
    $inputs.each(function () {
      if (this.id) {
        if (this.id == "newPaticiapntKey") {
          participants.push({
            rang: `R${participants.length + 1}`,
            publicKey: $(this).val()
          })
        } else {
          values[this.id] = $(this).val()
        }
      }
    })

    var tontine = {
      balance: 0,
      descriptif: values.tontineDefinition,
      goal: 24,
      montantACotiser: values.montantCotisation,
      nom: values.tontineName,
      nombreParticipants: values.maxParticiapnt
    }

    addTontine(tontine)
      .then((result) => {
        for (let i = 0; i < participants.length; i++) {
          const participant = participants[i]
          tontine.id = result.id
          addParticipant(participant)
            .then(function (result) {
              var tontineLocal = {
                balance: 0,
                descriptif: values.tontineDefinition,
                goal: 24,
                id: tontine.id,
                montantACotiser: values.montantCotisation,
                nom: values.tontineName,
                nombreParticipants: values.maxParticiapnt,
                participants: participants
              }
              listTontineLocal.push(tontineLocal)

              localStorage.setItem(
                "listTontineLocal",
                JSON.stringify(listTontineLocal)
              )

              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Vontre Tontine a bien ete créé",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  confirmButton: "btn btn-primary"
                },
                buttonsStyling: false
              })
              $("#creatTontine").modal("toggle")
              initVew()
            })
            .catch((error) => {})
        }
      })
      .catch((error) => {})
  })
})
