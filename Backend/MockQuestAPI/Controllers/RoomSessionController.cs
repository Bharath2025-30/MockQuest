using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MockQuestAPI.DTO_s.Requests;
using MockQuestAPI.Entities;
using MockQuestAPI.Enums;
using MockQuestAPI.Helpers;
using MockQuestAPI.ServiceContracts;
using MongoDB.Driver;
using StreamChat.Models;
using System.Threading.Tasks;
using ZstdSharp;

namespace MockQuestAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomSessionController : ControllerBase
    {
        private readonly ISessionService _sessionService;
        private readonly IStreamService _streamService;
        public RoomSessionController(ISessionService sessionService, IStreamService streamService)
        {
            _sessionService = sessionService;
            _streamService = streamService;
        }

        [HttpPost]
        [Route("")]
        public async Task<IActionResult> CreateSession(CreateSessionReqDto createSessionReqDto)
        {
            try
            {
                if(!ModelState.IsValid)
                    return BadRequest(ValidationsHelper.GetValidationErrorResponse(ModelState));


                // Generate a unique call id for Stream Video
                string callId = $"session_{DateTime.UtcNow:yyyyMMdd_HHmmss}_{Guid.NewGuid().ToString("N").Substring(0, 8)}";
                
                // Create session in DB
                var newSession = await _sessionService.CreateSession(new SessionRoom
                {
                    ProblemTitle = createSessionReqDto.ProblemTitle!,
                    ProblemDifficulty = createSessionReqDto.ProblemDifficulty,
                    HostId = Guid.Parse(createSessionReqDto.UserId!),
                    CallId = callId
                });

                // Create Stream video call
                await _streamService.CreateVideoSession(createSessionReqDto, newSession!.Id, callId);

                // Create Chat messaging
                await _streamService.CreateChatChannel(callId, createSessionReqDto.UserId!);

                return Ok(new
                {
                    Message = "Session Created successfully",
                    session = newSession
                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("active-sessions")]
        public async Task<IActionResult> GetAllActiveSessions()
        {
            try
            {
                List<SessionRoom> activeSessions = await _sessionService.GetAllActiveSessions();
                return Ok(activeSessions);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("previous-sessions/{userId}")]
        public async Task<IActionResult> GetMyPreviousSessions(Guid userId)
        {
            try
            {
                if(userId == Guid.Empty)
                {
                    return BadRequest("UserId can't be empty");
                }

                List<SessionRoom> previousSessions = await _sessionService.GetPreviousSessions(userId);
                return Ok(previousSessions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetSessionById(Guid id)
        {
            try
            {
                if (id == Guid.Empty)
                {
                    return BadRequest("UserId can't be empty");
                }

                SessionRoom? session = await _sessionService.GetSessionById(id);
                if(session is null)
                {
                    return NotFound(new
                    {
                        Message = "SessionRoom not found"
                    });
                }

                return Ok(session);

            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        [Route("{id}/join")]
        public async Task<IActionResult> JoinSession(Guid id, JoinSessionReqDto joinSessionReqDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ValidationsHelper.GetValidationErrorResponse(ModelState));

                SessionRoom? session = await _sessionService.GetSessionById(id);
                if(session is null)
                {
                    return NotFound(new
                    {
                        Message = "Session-Room not found"
                    });
                }

                // validation to check if session is already full - Has a participent
                if (session.Participant is not null)
                {
                    return BadRequest(new
                    {
                        Message = "session-room is already full"
                    });
                }

                session.ParticipantId = joinSessionReqDto.UserId;

                // update the session
                var updatedSession = await _sessionService.EditSessionRoom(session);

                // adding the user to the stream chat as a new member
                await _streamService.AddMembers(session.CallId, joinSessionReqDto.ClerkId);

                return Ok(updatedSession);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        [Route("{id}/end")]
        public async Task<IActionResult> EndSession([FromRoute] Guid id, EndSessionReqDto endSessionReqDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ValidationsHelper.GetValidationErrorResponse(ModelState));

                SessionRoom? session = await _sessionService.GetSessionById(id);
                if (session is null)
                {
                    return NotFound(new
                    {
                        Message = "Session-Room not found"
                    });
                }

                // checking if user is the host
                if (session.HostId != endSessionReqDto.UserId)
                    return Forbid("Didn't having privilege to end-session");

                // checking if session is already completed
                if (session.Status == RoomStatus.Completed)
                    return BadRequest("Session is already completed");

                // deleting the stream video-call and chat channel
                //await _streamService.DeleteVideoSession(session.CallId, endSessionReqDto.ClerkId);   //TODO : DLT isnt working need to check this later
                await _streamService.DeleteChatChannel(session.CallId);

                // updating the session
                session.Status = RoomStatus.Completed;
                SessionRoom? updatedSession = await _sessionService.EditSessionRoom(session);

                return Ok(new
                {
                    Message = "Session ended successfully",
                    updatedSession
                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
