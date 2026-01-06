unit Services.ProjectService;

interface

uses
  System.SysUtils,
  Models.Project,
  Database.ProjectRepository,
  Utils.Logger,
  Utils.Validator;

type
  TProjectService = class
  private
    FRepository: TProjectRepository;
    FLogger: TLogger;
    FValidator: TValidator;
  public
    constructor Create;
    destructor Destroy; override;
    
    function CreateProject(const AName, ADescription: string; AOwnerId: Integer): TProject;
    function GetProjectById(AProjectId: Integer): TProject;
    function GetProjectsByOwner(AOwnerId: Integer): TArray<TProject>;
    function GetAllProjects: TArray<TProject>;
    procedure UpdateProject(AProject: TProject);
    procedure DeleteProject(AProjectId: Integer);
    procedure StartProject(AProjectId: Integer);
    procedure CompleteProject(AProjectId: Integer);
  end;

implementation

constructor TProjectService.Create;
begin
  inherited;
  FRepository := TProjectRepository.Create;
  FLogger := TLogger.Create;
  FValidator := TValidator.Create;
end;

destructor TProjectService.Destroy;
begin
  FRepository.Free;
  FLogger.Free;
  FValidator.Free;
  inherited;
end;

function TProjectService.CreateProject(const AName, ADescription: string; AOwnerId: Integer): TProject;
begin
  FLogger.Log('Creating project: ' + AName);
  
  if not FValidator.ValidateString(AName, 3, 100) then
    raise Exception.Create('Invalid project name');
    
  Result := TProject.Create;
  Result.SetName(AName);
  Result.SetDescription(ADescription);
  Result.SetOwnerId(AOwnerId);
  
  FRepository.Save(Result);
  FLogger.Log('Project created with ID: ' + IntToStr(Result.GetId));
end;

function TProjectService.GetProjectById(AProjectId: Integer): TProject;
begin
  Result := FRepository.FindById(AProjectId);
end;

function TProjectService.GetProjectsByOwner(AOwnerId: Integer): TArray<TProject>;
begin
  Result := FRepository.FindByOwnerId(AOwnerId);
end;

function TProjectService.GetAllProjects: TArray<TProject>;
begin
  Result := FRepository.FindAll;
end;

procedure TProjectService.UpdateProject(AProject: TProject);
begin
  FLogger.Log('Updating project: ' + IntToStr(AProject.GetId));
  FRepository.Update(AProject);
end;

procedure TProjectService.DeleteProject(AProjectId: Integer);
begin
  FLogger.Log('Deleting project: ' + IntToStr(AProjectId));
  FRepository.Delete(AProjectId);
end;

procedure TProjectService.StartProject(AProjectId: Integer);
var
  Project: TProject;
begin
  Project := GetProjectById(AProjectId);
  if Assigned(Project) then
  begin
    Project.StartProject;
    UpdateProject(Project);
    FLogger.Log('Project started: ' + IntToStr(AProjectId));
  end;
end;

procedure TProjectService.CompleteProject(AProjectId: Integer);
var
  Project: TProject;
begin
  Project := GetProjectById(AProjectId);
  if Assigned(Project) then
  begin
    Project.CompleteProject;
    UpdateProject(Project);
    FLogger.Log('Project completed: ' + IntToStr(AProjectId));
  end;
end;

end.
